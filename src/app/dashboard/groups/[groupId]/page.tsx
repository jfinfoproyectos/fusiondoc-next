import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { GroupMembersPanel } from "@/features/groups/GroupMembersPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Users, Calendar, Lock, Unlock, BookOpen, ChevronRight, FileText } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { getAvailableProjects } from "@/lib/github";
import DynamicIcon from "@/components/DynamicIcon";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");
  
  const { groupId } = await params;
  const isAdmin = session.user.role === "admin";

  const groupMembership = await prisma.groupMembership.findUnique({
    where: {
      userId_groupId: {
        userId: session.user.id,
        groupId: groupId
      }
    }
  });

  const isMember = groupMembership?.status === "APPROVED";

  if (!isAdmin && !isMember) {
    redirect("/dashboard/groups");
  }

  const [group, allProjectsResult] = await Promise.all([
    prisma.group.findUnique({
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
    }),
    getAvailableProjects(),
  ]);

  if (!group) notFound();

  const { projects: allProjects } = allProjectsResult;
  const projectMap = new Map(allProjects.map(p => [p.id, p.name]));

  const doc = group.docFolder ? {
    id: group.docFolder,
    title: projectMap.get(group.docFolder) || group.docFolder,
    icon: allProjects.find(p => p.id === group.docFolder)?.icon || "lucide:file-text"
  } : null;

  const docFoldersWithTitles = doc ? [doc] : [];

  const members = group.memberships.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    image: m.user.image,
    role: m.user.role,
    joinedAt: m.createdAt,
  }));

  const defaultImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  return (
    <>
      <Toaster />
      <div className="max-w-5xl mx-auto space-y-10 pb-20">
        {/* Back Link */}
        <Link href="/dashboard/groups">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver a Grupos
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/60 backdrop-blur-3xl shadow-2xl">
            <div className="flex flex-col md:flex-row min-h-[280px]">
              {/* Image Section */}
              <div className="w-full md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                <img 
                  src={group.imageUrl || defaultImage} 
                  alt={group.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 flex flex-col justify-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={group.registrationOpen ? "default" : "secondary"} className="rounded-full px-3 py-0.5 font-bold uppercase tracking-widest text-[10px]">
                      {group.registrationOpen ? "Registro Abierto" : "Registro Cerrado"}
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-0.5 font-bold text-[10px] bg-background/50">
                      ID: {group.id}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight leading-tight">{group.name}</h1>
                  {group.description && (
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                      {group.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-border/20">
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Miembros</p>
                        <p className="text-lg font-bold tabular-nums">{members.length}</p>
                      </div>
                    </div>
                  )}

                  {group.startDate && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Periodo</p>
                        <p className="text-sm font-bold tabular-nums">
                          {new Date(group.startDate).toLocaleDateString("es", { day: '2-digit', month: 'short', year: 'numeric' })}
                          {group.endDate && ` — ${new Date(group.endDate).toLocaleDateString("es", { day: '2-digit', month: 'short', year: 'numeric' })}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 gap-10",
          isAdmin ? "lg:grid-cols-3" : "max-w-2xl mx-auto w-full"
        )}>
          {/* Members Panel (Left 2/3) */}
          {isAdmin && (
            <div className="lg:col-span-2">
              <GroupMembersPanel groupId={groupId} members={members} />
            </div>
          )}

          {/* Docs Section (Right 1/3 or Full Width) */}
          <div className={cn("space-y-6", !isAdmin && "w-full")}>
            <div className="bg-card/40 backdrop-blur-3xl border border-border/40 rounded-[2rem] p-6 shadow-xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Documentación Asignada
              </h3>
              
              {docFoldersWithTitles.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-border/40 rounded-2xl">
                  <p className="text-sm text-muted-foreground italic">No hay documentos asignados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {docFoldersWithTitles.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/${doc.id}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/20 hover:bg-primary/5 hover:border-primary/30 transition-all group/docitem shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary shadow-inner group-hover/docitem:rotate-3 transition-transform">
                        <DynamicIcon icon={doc.icon || "lucide:file-text"} width="20" height="20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate group-hover/docitem:text-primary transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter opacity-60">
                          {doc.id}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover/docitem:translate-x-1 group-hover/docitem:text-primary transition-all" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Config Quick Info */}
            <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Configuración de Acceso</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Los usuarios que soliciten acceso a este grupo obtendrán permisos de lectura para todas las documentaciones listadas arriba una vez que sean aprobados por un administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
