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
  description?: string | null;
  imageUrl?: string | null;
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

  const defaultImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {groups.map((group) => {
          const status = statuses[group.id];
          const isRegistrationClosed = !group.registrationOpen;

          return (
            <div key={group.id} className="relative group perspective-1000">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[1.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
                <Card className="h-full flex flex-col relative bg-card/60 backdrop-blur-3xl border-border/40 rounded-[1rem] overflow-hidden hover:border-primary/40 transition-all duration-500 shadow-lg hover:-translate-y-1 p-0">
                  {/* Wrappable Content Section */}
                  <div className="relative flex flex-col flex-1">
                    {status === "APPROVED" && (
                      <Link 
                        href={`/dashboard/groups/${group.id}`}
                        className="absolute inset-0 z-10"
                        title="Ver detalles del grupo"
                      />
                    )}
                    
                    {/* Header Image Section */}
                    <div className="relative h-32 w-full overflow-hidden bg-muted/20">
                       <img 
                        src={group.imageUrl || defaultImage} 
                        alt={group.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                       />
                       
                       {/* Status Overlay - Text Badges */}
                       <div className="absolute top-2 right-2 z-20">
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
                      <CardTitle className="text-sm font-black tracking-tight leading-tight group-hover:text-primary transition-colors truncate text-center w-full">
                        {group.name}
                      </CardTitle>
                    </CardHeader>
  
                    <CardContent className="flex-1 px-4 py-2 flex flex-col justify-center items-center gap-3">
                      {/* Dates - Micro */}
                      {(group.startDate || group.endDate) && (
                        <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-muted/30 border border-border/10">
                          <Calendar className="w-2.5 h-2.5 text-muted-foreground/60" />
                          <div className="text-[9px] font-bold tabular-nums truncate">
                            {group.startDate ? new Date(group.startDate).toLocaleDateString("es", { day: '2-digit', month: 'short' }) : "..."}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </div>

                  {/* Action Section - Keep interactive buttons outside the Link overlay or manage z-index */}
                  <div className="px-4 pb-4 mt-auto">
                    {status === "APPROVED" ? (
                      <div className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[8px] uppercase tracking-widest">
                        <BookOpen className="h-2.5 w-2.5" />
                        Ver Documentación
                      </div>
                    ) : status === "PENDING" ? (
                      <Button disabled variant="secondary" className="w-full h-7 rounded-lg text-[8px] font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Pendiente
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-7 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md bg-primary hover:bg-primary/90 transition-all relative z-20"
                        onClick={() => handleJoin(group.id)}
                        disabled={!!isRegistrationClosed || loadingId === group.id}
                      >
                        {loadingId === group.id ? "..." : isRegistrationClosed ? "Cerrado" : "Unirse"}
                      </Button>
                    )}
                  </div>
                </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
