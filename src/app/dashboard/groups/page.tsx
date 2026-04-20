import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { GroupManager } from "@/features/groups/GroupManager";
import { GroupCatalog } from "@/features/groups/GroupCatalog";
import { GroupMembershipRequests } from "@/features/groups/GroupMembershipRequests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ClipboardList, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { getAvailableProjects } from "@/lib/github";

export const dynamic = "force-dynamic";
export const metadata = { title: "Grupos" };

export default async function GroupsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const isAdmin = session.user.role === "admin";

  if (isAdmin) {
    // Admin: cargar grupos + solicitudes + carpetas disponibles
    const [groups, pendingMemberships, allProjects] = await Promise.all([
      prisma.group.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { memberships: true } } },
      }),
      prisma.groupMembership.findMany({
        where: { status: "PENDING" },
        include: {
          group: { select: { id: true, name: true } },
          user: { select: { id: true, name: true, email: true, image: true } },
        },
      }),
      getAvailableProjects(),
    ]);

    const projectMap = new Map(allProjects.map(p => [p.id, p.name]));
    const availableFolders = allProjects.map((p) => ({ id: p.id, name: p.name }));

    // Enriquecer grupos con títulos para la vista de lista del administrador
    const enrichedGroups = groups.map(g => ({
      ...g,
      docFoldersWithTitles: g.docFolders.map(id => ({ 
        id, 
        title: projectMap.get(id) || id,
        icon: allProjects.find(p => p.id === id)?.icon || "lucide:file-text",
        isPublic: allProjects.find(p => p.id === id)?.isPublic || false
      }))
    }));

    return (
      <>
        <Toaster />
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="h-11 rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="groups" className="rounded-lg gap-2 font-semibold text-sm px-4">
              <Users className="h-4 w-4" />
              Mis Grupos
              {groups.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {groups.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="rounded-lg gap-2 font-semibold text-sm px-4">
              <ClipboardList className="h-4 w-4" />
              Solicitudes
              {pendingMemberships.length > 0 && (
                <Badge className="ml-1 h-5 px-1.5 text-xs bg-amber-500 hover:bg-amber-500 text-white">
                  {pendingMemberships.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups">
            <GroupManager groups={enrichedGroups} availableFolders={availableFolders} />
          </TabsContent>

          <TabsContent value="requests">
            <GroupMembershipRequests requests={pendingMemberships} />
          </TabsContent>
        </Tabs>
      </>
    );
  }

  const [allGroups, allProjects] = await Promise.all([
    prisma.group.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { memberships: { where: { status: "APPROVED" } } } },
        memberships: {
          where: { userId: session.user.id },
          select: { status: true },
        },
      },
    }),
    getAvailableProjects(),
  ]);

  const projectMap = new Map(allProjects.map(p => [p.id, p.name]));

  const myGroups = allGroups.filter((g) => g.memberships[0]?.status === "APPROVED");

  const groupsWithStatus = allGroups.map((g) => ({
    ...g,
    docFoldersWithTitles: g.docFolders.map(id => ({ 
      id, 
      title: projectMap.get(id) || id,
      icon: allProjects.find(p => p.id === id)?.icon || "lucide:file-text",
      isPublic: allProjects.find(p => p.id === id)?.isPublic || false
    })),
    membershipStatus: (g.memberships[0]?.status ?? null) as
      | "APPROVED"
      | "PENDING"
      | "REJECTED"
      | null,
  }));

  return (
    <>
      <Toaster />
      <Tabs defaultValue="mine" className="space-y-6">
        <TabsList className="h-11 rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="mine" className="rounded-lg gap-2 font-semibold text-sm px-4">
            <Users className="h-4 w-4" />
            Mis Grupos
            {myGroups.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {myGroups.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="catalog" className="rounded-lg gap-2 font-semibold text-sm px-4">
            <BookOpen className="h-4 w-4" />
            Grupos para inscribirse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          <div className="space-y-4">
            <GroupCatalog
              groups={groupsWithStatus.filter((g) => g.membershipStatus === "APPROVED")}
            />
          </div>
        </TabsContent>

        <TabsContent value="catalog">
          <GroupCatalog 
            groups={groupsWithStatus.filter((g) => g.membershipStatus === null || g.membershipStatus === "REJECTED")} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
