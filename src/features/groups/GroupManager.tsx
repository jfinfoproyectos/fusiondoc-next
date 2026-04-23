"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DynamicIcon from "@/components/DynamicIcon";
import {
  Plus,
  Trash2,
  Pencil,
  Users,
  Lock,
  Unlock,
  Calendar,
  BookOpen,
  ChevronRight,
  FolderLock,
  FolderOpen,
  FileText,
} from "lucide-react";
import {
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
  toggleGroupRegistrationAction,
} from "@/app/actions/groups";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  description: string | null;
  registrationOpen: boolean;
  startDate: Date | string | null;
  endDate: Date | string | null;
  docFolders: string[];
  docFoldersWithTitles?: { id: string; title: string; icon?: string; isPublic?: boolean }[];
  _count: { memberships: number };
}

interface DocFolder {
  id: string;
  name: string;
}

// ─── Form Dialog ─────────────────────────────────────────────────────────────

function GroupFormDialog({
  mode,
  group,
  trigger,
  availableFolders,
}: {
  mode: "create" | "edit";
  group?: Group;
  trigger: React.ReactNode;
  availableFolders: DocFolder[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFolders, setSelectedFolders] = useState<string[]>(
    group?.docFolders ?? []
  );

  const toggleFolder = (folderId: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((f) => f !== folderId) : [...prev, folderId]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // docFolders como lista separada por coma
    formData.set("docFolders", selectedFolders.join(","));
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createGroupAction(formData);
          toast.success("Grupo creado correctamente");
          setSelectedFolders([]);
        } else {
          await updateGroupAction(formData);
          toast.success("Grupo actualizado correctamente");
        }
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al guardar el grupo");
      }
    });
  };

  const toInputDate = (d: Date | string | null | undefined) => {
    if (!d) return "";
    return new Date(d).toISOString().slice(0, 16);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSelectedFolders(group?.docFolders ?? []);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear Grupo" : "Editar Grupo"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa la información para crear un nuevo grupo."
              : "Modifica los datos del grupo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {group && <input type="hidden" name="groupId" value={group.id} />}

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del grupo <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Desarrollo Web 2025"
              defaultValue={group?.name}
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="Descripción breve del grupo"
              defaultValue={group?.description || ""}
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                defaultValue={toInputDate(group?.startDate)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                defaultValue={toInputDate(group?.endDate)}
              />
            </div>
          </div>


          {/* Estado de inscripción (solo edit) */}
          {mode === "edit" && (
            <div className="space-y-2">
              <Label>Estado de inscripción</Label>
              <select
                name="registrationOpen"
                defaultValue={group?.registrationOpen ? "true" : "false"}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="true">Abierta</option>
                <option value="false">Cerrada</option>
              </select>
            </div>
          )}

          {/* Documentaciones asignadas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="flex-1">Documentaciones asignadas</Label>
              {selectedFolders.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedFolders.length} seleccionada{selectedFolders.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground -mt-1">
              Solo los miembros aprobados de este grupo podrán acceder a estas documentaciones.
            </p>
            {availableFolders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-xl">
                No hay carpetas de docs disponibles.
              </p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {availableFolders.map((folder) => {
                  const isSelected = selectedFolders.includes(folder.id);
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => toggleFolder(folder.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-primary/50 bg-primary/5 text-primary"
                          : "border-border/50 bg-muted/10 hover:bg-muted/20 text-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <FolderLock className="h-4 w-4 shrink-0" />
                      ) : (
                        <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{folder.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{folder.id}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : mode === "create" ? "Crear Grupo" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

function DeleteGroupDialog({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteGroupAction(group.id);
        toast.success("Grupo eliminado");
        setOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Grupo</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminarán todas las membresías de{" "}
            <strong>{group.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="confirm-delete">
            Escribe <strong>ELIMINAR</strong> para confirmar
          </Label>
          <Input
            id="confirm-delete"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="ELIMINAR"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirm !== "ELIMINAR" || isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar Grupo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main GroupManager ─────────────────────────────────────────────────────────

export function GroupManager({
  groups,
  availableFolders,
}: {
  groups: Group[];
  availableFolders: DocFolder[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (groupId: string, currentState: boolean) => {
    startTransition(async () => {
      try {
        await toggleGroupRegistrationAction(groupId, !currentState);
        toast.success(currentState ? "Inscripciones cerradas" : "Inscripciones abiertas");
      } catch {
        toast.error("Error al cambiar el estado");
      }
    });
  };

  const now = new Date();
  const activeGroups = groups.filter((g) => !g.endDate || new Date(g.endDate) >= now);
  const archivedGroups = groups.filter((g) => g.endDate && new Date(g.endDate) < now);

  const GroupGrid = ({ items }: { items: Group[] }) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl text-center">
          <div className="p-4 bg-muted/20 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <p className="text-xl font-semibold text-muted-foreground">No hay grupos en esta categoría</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Crea el primero usando el botón de arriba</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((group) => (
          <div key={group.id} className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Card className="h-full flex flex-col relative bg-background/60 backdrop-blur-xl border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-foreground/10" />

              <CardHeader className="pb-4 pt-6 px-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] px-2.5 h-6 font-bold uppercase tracking-wider">
                      <Users className="h-3 w-3 mr-1.5" />
                      {group._count.memberships} Miembros
                    </Badge>
                    <Badge
                      variant={group.registrationOpen ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] px-2.5 h-6 font-bold uppercase tracking-wider",
                        group.registrationOpen ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      )}
                    >
                      {group.registrationOpen ? (
                        <><Unlock className="h-3 w-3 mr-1.5" /> Abierto</>
                      ) : (
                        <><Lock className="h-3 w-3 mr-1.5" /> Cerrado</>
                      )}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight max-w-[90%]">
                    {group.name}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex-1 px-6 py-2 space-y-6">
                {/* Fechas Simétricas */}
                {(group.startDate || group.endDate) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/50 group-hover:bg-muted/50 transition-colors">
                      <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1.5">Inicio</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary/70" />
                        <span className="text-xs font-bold tabular-nums">
                          {group.startDate ? new Date(group.startDate).toLocaleDateString("es", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "--/--/--"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/50 group-hover:bg-muted/50 transition-colors">
                      <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1.5">Fin</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-destructive/70" />
                        <span className="text-xs font-bold tabular-nums">
                          {group.endDate ? new Date(group.endDate).toLocaleDateString("es", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "--/--/--"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Docs asignadas con Iconos Dinámicos */}
                {group.docFolders.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] flex items-center justify-center gap-2">
                      <FolderLock className="h-3.5 w-3.5" />
                      Documentación Disponible
                    </p>
                    <div className="flex flex-col gap-2 w-full max-w-sm mx-auto">
                      {(group.docFoldersWithTitles ?? []).map((doc) => (
                        <Link 
                          key={doc.id} 
                          href={`/${doc.id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/10 text-xs font-bold text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all group/doc shadow-sm relative overflow-hidden"
                        >
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                            <DynamicIcon icon={doc.icon || "lucide:file-text"} width="16" height="16" />
                          </div>
                          <span className="flex-1 truncate">{doc.title}</span>
                          {doc.isPublic ? (
                            <Badge variant="outline" className="text-[9px] h-5 px-1.5 font-black bg-emerald-500/10 text-emerald-600 border-emerald-500/20 uppercase tracking-tighter">Público</Badge>
                          ) : (
                            <span className="text-[10px] text-muted-foreground font-mono opacity-50 uppercase tracking-tighter text-[9px]">Protegido</span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover/doc:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground/50 italic py-2">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Sin documentaciones asignadas
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-2 flex flex-col gap-3">
                {/* Actions Centralized Toolbar */}
                <div className="flex items-center w-full bg-muted/40 p-1.5 rounded-2xl border border-border/40 shadow-inner">
                  <GroupFormDialog
                    mode="edit"
                    group={group}
                    availableFolders={availableFolders}
                    trigger={
                      <Button variant="ghost" size="sm" className="flex-1 h-9 font-bold text-xs gap-2 text-muted-foreground hover:text-primary hover:bg-background rounded-xl transition-all">
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">Editar</span>
                      </Button>
                    }
                  />
                  <div className="w-px h-5 bg-border/60 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex-1 h-9 font-bold text-xs gap-2 rounded-xl transition-all ${
                      group.registrationOpen
                        ? "text-muted-foreground hover:text-amber-600 hover:bg-amber-50"
                        : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                    onClick={() => handleToggle(group.id, group.registrationOpen)}
                    disabled={isPending}
                  >
                    {group.registrationOpen ? (
                      <><Lock className="h-3.5 w-3.5" /><span className="hidden lg:inline">Cerrar</span></>
                    ) : (
                      <><Unlock className="h-3.5 w-3.5" /><span className="hidden lg:inline">Abrir</span></>
                    )}
                  </Button>
                  <div className="w-px h-5 bg-border/60 mx-1" />
                  <div className="flex-1 flex justify-center">
                    <DeleteGroupDialog group={group} />
                  </div>
                </div>

                {/* View members Button (Symmetric) */}
                <Link href={`/dashboard/groups/${group.id}`} className="w-full">
                  <Button variant="outline" className="w-full h-11 text-xs font-black uppercase tracking-[0.1em] gap-2 rounded-2xl border-border/60 bg-background/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm">
                    <Users className="h-4 w-4" />
                    Ver Miembros
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Grupos</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {groups.length} grupo{groups.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <GroupFormDialog
          mode="create"
          availableFolders={availableFolders}
          trigger={
            <Button className="gap-2 rounded-xl font-semibold shadow-md">
              <Plus className="h-4 w-4" />
              Nuevo Grupo
            </Button>
          }
        />
      </div>

      {archivedGroups.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Activos ({activeGroups.length})
            </h3>
            <GroupGrid items={activeGroups} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Archivados ({archivedGroups.length})
            </h3>
            <GroupGrid items={archivedGroups} />
          </div>
        </div>
      ) : (
        <GroupGrid items={activeGroups} />
      )}
    </div>
  );
}
