import { getDocContent, isFutureDate, getAvailableProjects } from '@/lib/github';
import matter from 'gray-matter';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import RightSidebar from '@/components/RightSidebar';
import UpdateBanner from '@/components/UpdateBanner';
import NavigationGrid from '@/components/NavigationGrid';
import { notFound, redirect } from 'next/navigation';
import { SITE_CONFIG } from '@/config';
import DocsShell from '@/components/DocsShell';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getDocAccess } from '@/lib/doc-access';
import DocAccessDenied from '@/features/groups/DocAccessDenied';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return notFound();
  }

  // Las verificaciones de Auth y Acceso por Grupo ya se manejan en el middleware (proxy.ts)
  // El middleware reescribe a /project/access-denied si el usuario no tiene permiso.
  const projects = await getAvailableProjects();
  const headersList = await headers();
  const subdomainMode = !!headersList.get('x-project-id');

  // Determinar el projectId (folder de primer nivel en /docs)
  const projectId = projects.some(p => p.id === slug[0])
    ? slug[0]
    : projects[0]?.id ?? slug[0];

  // Si el middleware nos mandó aquí por falta de acceso
  if (slug[slug.length - 1] === "access-denied") {
    const session = await auth.api.getSession({ headers: headersList });
    const access = await getDocAccess(projectId, session?.user.id ?? null);
    
    return (
      <DocAccessDenied
        folderId={projectId}
        authenticated={!!session}
        grantingGroups={access.grantingGroups}
        membershipStatus={access.membershipStatus}
      />
    );
  }

  // ────────────────────────────────────────────────────────────────
  // 3. Renderizar el documento (comportamiento original)
  // ────────────────────────────────────────────────────────────────
  const docResult = await getDocContent(slug);

  if (!docResult) {
    return notFound();
  }

  const { data: frontmatter, content } = matter(docResult.content);

  // Ocultar borradores
  if (frontmatter.draft === true) {
    return notFound();
  }

  // Publicación programada
  if (isFutureDate(frontmatter.date)) {
    return notFound();
  }

  const slugStr = slug.join('/');

  return (
    <div className="flex w-full">
      <div className="flex-1 min-w-0 py-4 md:py-8 px-4 sm:px-6 md:px-12 lg:px-16">
        {!docResult.fromCache && (
          <UpdateBanner sha={docResult.sha} slug={slugStr} />
        )}

        {frontmatter.title && (
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6 md:mb-8">
            {frontmatter.title}
          </h1>
        )}
        <MarkdownRenderer content={content} />
        {docResult.children && docResult.children.length > 0 && (
          <div className="mt-8 md:mt-12">
            <NavigationGrid items={docResult.children} />
          </div>
        )}
      </div>
      <RightSidebar />
    </div>
  );
}
