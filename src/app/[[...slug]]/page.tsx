import { getDocContent, isFutureDate } from '@/lib/github';
import matter from 'gray-matter';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import RightSidebar from '@/components/RightSidebar';
import UpdateBanner from '@/components/UpdateBanner';
import NavigationGrid from '@/components/NavigationGrid';
import { notFound } from 'next/navigation';

// Forzar renderizado dinámico para que siempre verifique el SHA del árbol
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const docResult = await getDocContent(slug);

  if (!docResult) {
    return notFound();
  }

  const { data: frontmatter, content } = matter(docResult.content);

  // Ocultar borradores
  if (frontmatter.draft === true) {
    return notFound();
  }

  // Publicación programada: ocultar si la fecha es futura
  if (isFutureDate(frontmatter.date)) {
    return notFound();
  }


  // Computar el slug string para el banner
  const slugStr = slug ? slug.join('/') : 'index';

  return (
    <div className="flex w-full">
      <div className="flex-1 min-w-0 py-8 px-6 md:px-12 lg:px-16">
        {/* Banner de contenido actualizado (solo si no vino de caché) */}
        {!docResult.fromCache && (
          <UpdateBanner sha={docResult.sha} slug={slugStr} />
        )}

        {frontmatter.title && (
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">
            {frontmatter.title}
          </h1>
        )}
        <MarkdownRenderer content={content} />
        {docResult.children && docResult.children.length > 0 && (
          <NavigationGrid items={docResult.children} />
        )}
      </div>
      <RightSidebar />
    </div>
  );
}
