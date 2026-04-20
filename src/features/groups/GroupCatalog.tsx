"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Clock, Lock, Users, ChevronRight, FolderLock } from "lucide-react";
import Link from "next/link";
import { requestGroupJoinAction } from "@/app/actions/groups";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DynamicIcon from "@/components/DynamicIcon";

interface Group {
  id: string;
  name: string;
  registrationOpen: boolean;
  startDate: Date | string | null;
  endDate: Date | string | null;
  docFolders: string[];
  docFoldersWithTitles?: { id: string; title: string; icon?: string }[];
}

type MembershipStatus = "APPROVED" | "PENDING" | "REJECTED" | null;

interface GroupWithMembership extends Group {
  membershipStatus: MembershipStatus;
}

export function GroupCatalog({ groups }: { groups: GroupWithMembership[] }) {
  const [statuses, setStatuses] = useState<Record<string, MembershipStatus>>(
    Object.fromEntries(groups.map((g) => [g.id, g.membershipStatus]))
  );
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleJoin = (groupId: string) => {
    setLoadingId(groupId);
    startTransition(async () => {
      try {
        await requestGroupJoinAction(groupId);
        setStatuses((prev) => ({ ...prev, [groupId]: "PENDING" }));
        toast.success("¡Solicitud enviada! Espera la aprobación del administrador.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al solicitar inscripción");
      } finally {
        setLoadingId(null);
      }
    });
  };

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border rounded-3xl text-center">
        <div className="p-4 bg-muted/20 rounded-full mb-4">
          <BookOpen className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground">No hay grupos disponibles</h3>
        <p className="text-sm text-muted-foreground/60 mt-1">
          El administrador aún no ha creado grupos con inscripciones abiertas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const status = statuses[group.id];
          const isRegistrationClosed = !group.registrationOpen;

          return (
            <div key={group.id} className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="h-full flex flex-col relative bg-background/60 backdrop-blur-xl border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-foreground/10" />

                <CardHeader className="pb-4 pt-6 px-6 flex flex-col items-center text-center">
                  <div className="space-y-4 w-full">
                    <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">
                      {group.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 px-6 py-2 flex flex-col justify-between gap-6">
                  {/* Dates Simétricas */}
                  {(group.startDate || group.endDate) && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/50 group-hover:bg-muted/50 transition-colors">
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1.5 text-center">Inicio</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary/70" />
                          <span className="text-xs font-bold tabular-nums text-center whitespace-nowrap">
                            {group.startDate ? new Date(group.startDate).toLocaleDateString("es", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "--/--/--"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-muted/30 border border-border/50 group-hover:bg-muted/50 transition-colors">
                        <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mb-1.5 text-center">Fin</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-destructive/70" />
                          <span className="text-xs font-bold tabular-nums text-center whitespace-nowrap">
                            {group.endDate ? new Date(group.endDate).toLocaleDateString("es", { day: '2-digit', month: '2-digit', year: 'numeric' }) : "--/--/--"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Assigned Documentation (Visible to everyone, but links only for approved) */}
                  {(group.docFoldersWithTitles ?? []).length > 0 && (
                    <div className="space-y-4 pt-2 border-t border-border/40">
                       <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                         <FolderLock className="h-4 w-4 text-primary" />
                         Documentación Incluida
                       </h4>
                       <div className="flex flex-col gap-2.5">
                         {(group.docFoldersWithTitles ?? []).map((doc) => {
                           const content = (
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0 transition-transform group-hover/docinfo:scale-105">
                                 <DynamicIcon icon={doc.icon || "lucide:file-text"} width="24" height="24" />
                               </div>
                               <div className="flex flex-col min-w-0">
                                 <span className="font-extrabold text-sm truncate">{doc.title}</span>
                                 <span className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-tighter">Acceso Protegido</span>
                               </div>
                             </div>
                           );

                           if (status === "APPROVED") {
                             return (
                               <Link
                                 key={doc.id}
                                 href={`/${doc.id}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center justify-between gap-3 px-5 py-4 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/30 transition-all group/docinfo shadow-sm"
                               >
                                 {content}
                                 <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/40 group-hover/docinfo:translate-x-1.5 transition-transform">
                                   <ChevronRight className="h-4 w-4 text-primary" />
                                 </div>
                               </Link>
                             );
                           }

                           return (
                             <div
                               key={doc.id}
                               className="flex items-center justify-between gap-3 px-5 py-4 rounded-3xl bg-muted/20 border border-border/30 opacity-80 grayscale-[0.5] group/docinfo"
                             >
                               {content}
                               <Lock className="h-4 w-4 text-muted-foreground/40" />
                             </div>
                           );
                         })}
                       </div>
                    </div>
                  )}

                  {/* Action buttons Simétricos */}
                  <div className="mt-4 pt-4 border-t border-border/40">
                    {status === "APPROVED" ? (
                       null 
                    ) : status === "PENDING" ? (
                      <Button disabled variant="secondary" className="w-full h-11 rounded-2xl text-xs font-bold uppercase tracking-wider bg-muted/50 border border-border/60">
                        <Clock className="h-4 w-4 mr-2.5" />
                        Solicitud pendiente
                      </Button>
                    ) : status === "REJECTED" ? (
                      <Button
                        className="w-full h-11 rounded-2xl text-xs font-bold uppercase tracking-wider"
                        variant="outline"
                        onClick={() => handleJoin(group.id)}
                        disabled={!!isRegistrationClosed || loadingId === group.id}
                      >
                        Solicitar de nuevo
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-11 rounded-2xl text-xs font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
                        onClick={() => handleJoin(group.id)}
                        disabled={!!isRegistrationClosed || loadingId === group.id}
                      >
                        {loadingId === group.id
                          ? "Procesando..."
                          : isRegistrationClosed
                          ? "Cerrado"
                          : "Inscribirme"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
