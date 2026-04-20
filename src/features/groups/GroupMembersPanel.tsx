"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserMinus, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { removeGroupMemberAction } from "@/app/actions/groups";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string | null;
  joinedAt: Date | string;
}

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function GroupMembersPanel({
  groupId,
  members: initialMembers,
}: {
  groupId: string;
  members: Member[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = (userId: string, name: string) => {
    if (!confirm(`¿Eliminar a ${name} del grupo? Esta acción no se puede deshacer.`)) return;
    setProcessingId(userId);
    startTransition(async () => {
      try {
        await removeGroupMemberAction(userId, groupId);
        setMembers((prev) => prev.filter((m) => m.id !== userId));
        toast.success(`${name} eliminado del grupo`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar miembro");
      } finally {
        setProcessingId(null);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Miembros del Grupo
            </CardTitle>
            <CardDescription>
              {members.length} miembro{members.length !== 1 ? "s" : ""} activo{members.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Buscar miembro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 h-9 rounded-xl text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {members.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>Este grupo no tiene miembros aún.</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-sm">No se encontraron miembros.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="group flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/20 rounded-2xl border border-transparent hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-background ring-2 ring-primary/10">
                    <AvatarImage src={member.image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{member.name}</p>
                      {member.role === "admin" && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold gap-1">
                          <Shield className="h-2.5 w-2.5" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-8 px-3 gap-1.5 transition-all"
                  onClick={() => handleRemove(member.id, member.name)}
                  disabled={processingId === member.id}
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">Quitar</span>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
