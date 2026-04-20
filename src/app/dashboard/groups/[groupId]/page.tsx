import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { GroupMembersPanel } from "@/features/groups/GroupMembersPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Lock, Unlock } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") redirect("/dashboard/groups");

  const { groupId } = await params;

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      memberships: {
        where: { status: "APPROVED" },
        include: {
          user: { select: { id: true, name: true, email: true, image: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { memberships: true } },
    },
  });

  if (!group) notFound();

  const members = group.memberships.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    image: m.user.image,
    role: m.user.role,
    joinedAt: m.createdAt,
  }));

  return (
    <>
      <Toaster />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Link href="/dashboard/groups">
              <Button variant="ghost" size="sm" className="gap-2 -ml-2 mb-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Volver a Grupos
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
            {group.description && (
              <p className="text-muted-foreground">{group.description}</p>
            )}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <Badge variant="outline" className="gap-1.5 text-xs font-bold">
                <Users className="h-3 w-3" />
                {members.length} miembros aprobados
              </Badge>
              <Badge
                variant={group.registrationOpen ? "default" : "secondary"}
                className="gap-1.5 text-xs font-bold"
              >
                {group.registrationOpen ? (
                  <><Unlock className="h-3 w-3" /> Inscripciones abiertas</>
                ) : (
                  <><Lock className="h-3 w-3" /> Inscripciones cerradas</>
                )}
              </Badge>
              {group.startDate && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(group.startDate).toLocaleDateString("es")}
                  {group.endDate && ` → ${new Date(group.endDate).toLocaleDateString("es")}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Members panel */}
        <GroupMembersPanel groupId={groupId} members={members} />
      </div>
    </>
  );
}
