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
  Shield,
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
  imageUrl?: string | null;
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] border-border/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic">{mode === "create" ? "Crear Grupo" : "Editar Grupo"}</DialogTitle>
          <DialogDescription className="text-base font-medium">
            {mode === "create"
              ? "Completa la información para crear un nuevo grupo."
              : "Modifica los datos del grupo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {group && <input type="hidden" name="groupId" value={group.id} />}

          {/* Nombre */}
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre del grupo <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Desarrollo Web 2025"
              defaultValue={group?.name}
              required
              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="Descripción breve del grupo"
              defaultValue={group?.description || ""}
              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2.5">
            <Label htmlFor="imageUrl" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">URL de la Imagen</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://images.unsplash.com/..."
              defaultValue={group?.imageUrl || ""}
              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <Label htmlFor="startDate" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Fecha de inicio</Label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                defaultValue={toInputDate(group?.startDate)}
                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="endDate" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Fecha de fin</Label>
              <Input
                id="endDate"
                name="endDate"
                type="datetime-local"
                defaultValue={toInputDate(group?.endDate)}
                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
              />
            </div>
          </div>


          {/* Estado de inscripción (solo edit) */}
          {mode === "edit" && (
            <div className="space-y-2.5">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Estado de inscripción</Label>
              <select
                name="registrationOpen"
                defaultValue={group?.registrationOpen ? "true" : "false"}
                className="w-full h-12 px-4 rounded-xl border border-border/50 bg-muted/30 text-sm focus:bg-background transition-all"
              >
                <option value="true">Abierta</option>
                <option value="false">Cerrada</option>
              </select>
            </div>
          )}

          {/* Documentaciones asignadas */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Label className="flex-1 text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Documentaciones asignadas</Label>
              {selectedFolders.length > 0 && (
                <Badge variant="secondary" className="text-[10px] font-black bg-primary/10 text-primary">
                  {selectedFolders.length} seleccionada{selectedFolders.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            {availableFolders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-3 text-center border border-dashed rounded-xl">
                No hay carpetas de docs disponibles.
              </p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-2 custom-scrollbar">
                {availableFolders.map((folder) => {
                  const isSelected = selectedFolders.includes(folder.id);
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => toggleFolder(folder.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-primary/50 bg-primary/5 text-primary"
                          : "border-border/30 bg-muted/10 hover:bg-muted/20 text-foreground"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {isSelected ? <FolderLock className="h-5 w-5" /> : <FolderOpen className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{folder.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-tight">{folder.id}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-border/40">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl px-8 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
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
        <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] border-border/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic">Eliminar Grupo</DialogTitle>
          <DialogDescription className="text-base font-medium">
            Esta acción no se puede deshacer. Se eliminarán todas las membresías de{" "}
            <strong className="text-foreground">{group.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <Label htmlFor="confirm-delete" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Escribe <strong className="text-destructive">ELIMINAR</strong> para confirmar
          </Label>
          <Input
            id="confirm-delete"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="ELIMINAR"
            className="h-12 rounded-xl bg-destructive/5 border-destructive/20 focus:bg-background transition-all text-center font-black tracking-widest uppercase"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold">Cancelar</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirm !== "ELIMINAR" || isPending}
            className="rounded-xl px-8 font-black uppercase tracking-widest shadow-lg shadow-destructive/20 transition-all"
          >
            {isPending ? "Eliminando..." : "Confirmar Eliminación"}
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
        toast.error("Error al cambiar estado");
      }
    });
  };

  const defaultImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  const GroupGrid = ({ items }: { items: Group[] }) => {
    if (items.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((group) => (
          <div key={group.id} className="relative group perspective-1000">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[1.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Card className="h-full flex flex-col relative bg-card/60 backdrop-blur-3xl border-border/40 rounded-[1rem] overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-lg hover:-translate-y-1 p-0">
              {/* Header Image Section - Improved framing */}
              <div className="relative h-32 w-full overflow-hidden bg-muted/20">
                 <img 
                  src={group.imageUrl || defaultImage} 
                  alt={group.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                 />
                 
                 {/* Status Overlay - Text Badges */}
                 <div className="absolute top-2 right-2">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[7px] px-1.5 h-4 font-black uppercase tracking-widest border-none shadow-lg backdrop-blur-md",
                        group.registrationOpen 
                          ? "bg-emerald-500/90 text-white" 
                          : "bg-amber-500/90 text-white"
                      )}
                    >
                      {group.registrationOpen ? "Abierto" : "Cerrado"}
                    </Badge>
                 </div>
              </div>

              <CardHeader className="pb-0 pt-3 px-4 flex flex-col items-center">
                <CardTitle className="text-sm font-black tracking-tight group-hover:text-primary transition-colors truncate text-center w-full">
                  {group.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 py-3 flex flex-col justify-center items-center">
                <div className="space-y-3 w-full">
                  {/* Actions Toolbar - Integrated & Centered */}
                  <div className="flex items-center w-full bg-muted/40 p-0.5 rounded-lg border border-border/20">
                    <GroupFormDialog
                      mode="edit"
                      group={group}
                      availableFolders={availableFolders}
                      trigger={
                        <Button variant="ghost" size="sm" className="flex-1 h-6 font-bold text-[8px] gap-1 text-muted-foreground hover:text-primary rounded-md">
                          <Pencil className="h-2.5 w-2.5" />
                        </Button>
                      }
                    />
                    <div className="w-px h-3 bg-border/20 mx-0.5" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "flex-1 h-6 font-bold text-[8px] rounded-md transition-all",
                        group.registrationOpen ? "hover:text-amber-600" : "hover:text-emerald-600"
                      )}
                      onClick={() => handleToggle(group.id, group.registrationOpen)}
                      disabled={isPending}
                    >
                      {group.registrationOpen ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                    </Button>
                    <div className="w-px h-3 bg-border/20 mx-0.5" />
                    <div className="flex-1 flex justify-center">
                      <DeleteGroupDialog group={group} />
                    </div>
                  </div>

                  <Link href={`/dashboard/groups/${group.id}`} className="w-full block">
                    <Button variant="outline" className="w-full h-7 text-[8px] font-black uppercase tracking-widest gap-1 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-all flex justify-center items-center">
                      <BookOpen className="h-2.5 w-2.5" />
                      Ver Documentación
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  const now = new Date();
  const activeGroups = groups.filter((g) => !g.endDate || new Date(g.endDate) >= now);
  const archivedGroups = groups.filter((g) => g.endDate && new Date(g.endDate) < now);

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
