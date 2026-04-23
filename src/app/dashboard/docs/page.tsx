import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAvailableProjects } from "@/lib/github";
import { GITHUB_CONFIG } from "@/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Files,
  Edit3,
  Search
} from "lucide-react";
import Link from "next/link";
import { DocStatusToggle } from "@/components/DocStatusToggle";
import { CreateProjectDialog } from "@/features/admin/CreateProjectDialog";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";
export const metadata = { title: "Documentación | Panel" };

export default async function DocsScannerPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const isAdmin = session.user.role === "admin";
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Files className="w-12 h-12 text-muted-foreground opacity-20" />
        <h2 className="text-xl font-bold">Acceso Restringido</h2>
        <p className="text-muted-foreground">Solo los administradores pueden escanear las documentaciones.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/groups">Volver a Grupos</Link>
        </Button>
      </div>
    );
  }

  const projects = await getAvailableProjects();

  const buildGithubUrl = (id: string) => {
    const { owner, repo, branch, docsPath } = GITHUB_CONFIG;
    return `https://github.com/${owner}/${repo}/tree/${branch}/${docsPath}/${id}`;
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Documentación</h1>
          <p className="text-muted-foreground font-medium">
            Listado de todos los proyectos de documentación detectados. Gestiona la visibilidad y edita el contenido.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Nombre</TableHead>
              <TableHead className="font-bold">ID / Slug</TableHead>
              <TableHead className="font-bold">Estado de Acceso</TableHead>
              <TableHead className="text-right font-bold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No se encontraron documentaciones disponibles en el repositorio.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                         <Files className="w-4 h-4" />
                      </div>
                      <span className="font-bold">{project.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      {project.id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <DocStatusToggle 
                      id={project.id} 
                      initialIsPublic={project.isPublic || false} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild size="sm" variant="secondary" className="gap-2 h-9 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                        <Link href={`/dashboard/admin/docs/${project.id}`}>
                          <Edit3 className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                      </Button>
                      
                      <Button asChild size="sm" variant="ghost" className="gap-2 h-9 rounded-xl font-bold bg-muted/30 border border-border/40">
                        <a 
                          href={buildGithubUrl(project.id)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          GitHub
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
