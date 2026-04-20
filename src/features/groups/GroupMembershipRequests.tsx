"use client";

import { useState, useTransition, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, Filter, UserCheck } from "lucide-react";
import { approveGroupMembershipAction, rejectGroupMembershipAction } from "@/app/actions/groups";
import { toast } from "sonner";

interface PendingMembership {
  id: string;
  group: { id: string; name: string };
  user: { id: string; name: string; email: string; image: string | null };
  createdAt: Date | string;
}

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "hace un momento";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

export function GroupMembershipRequests({
  requests: initialRequests,
}: {
  requests: PendingMembership[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const uniqueGroups = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => {
      if (!map.has(r.group.id)) map.set(r.group.id, r.group.name);
    });
    return Array.from(map.entries());
  }, [requests]);

  const filtered = useMemo(
    () => (filter === "all" ? requests : requests.filter((r) => r.group.id === filter)),
    [requests, filter]
  );

  const handleApprove = (id: string) => {
    setProcessingId(id);
    startTransition(async () => {
      try {
        await approveGroupMembershipAction(id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
        toast.success("Usuario aprobado al grupo");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al aprobar");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    startTransition(async () => {
      try {
        await rejectGroupMembershipAction(id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
        toast.success("Solicitud rechazada");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al rechazar");
      } finally {
        setProcessingId(null);
      }
    });
  };

  if (requests.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-muted/5">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Check className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-xl font-semibold">¡Al día!</p>
            <p className="text-muted-foreground text-sm mt-1">No hay solicitudes de inscripción pendientes.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              Solicitudes de Inscripción
            </CardTitle>
            <CardDescription>Usuarios esperando unirse a tus grupos.</CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {uniqueGroups.length > 1 && (
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-52 h-9 rounded-xl text-xs">
                  <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  {uniqueGroups.map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Badge variant="secondary" className="h-9 px-4 rounded-xl text-sm font-bold">
              {filtered.length} solicitud{filtered.length !== 1 ? "es" : ""}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">
              No hay solicitudes para este filtro.
            </p>
          ) : (
            filtered.map((req) => (
              <div
                key={req.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/10 hover:bg-muted/20 rounded-2xl border border-transparent hover:border-primary/20 transition-all gap-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-primary/10">
                    <AvatarImage src={req.user.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {getInitials(req.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="font-semibold group-hover:text-primary transition-colors">{req.user.name}</p>
                    <p className="text-sm text-muted-foreground">{req.user.email}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px] font-bold h-5 border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                        {req.group.name}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo(req.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white rounded-xl h-9 px-4 font-semibold transition-all"
                    onClick={() => handleReject(req.id)}
                    disabled={processingId === req.id}
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Rechazar
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-4 font-semibold shadow-md shadow-emerald-600/20"
                    onClick={() => handleApprove(req.id)}
                    disabled={processingId === req.id}
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Aprobar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
