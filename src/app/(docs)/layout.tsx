import { getAvailableProjects } from '@/lib/github';
import DocsShell from '@/components/DocsShell';
import { headers } from 'next/headers';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function SlugLayout({ children }: LayoutProps) {
  const projects = await getAvailableProjects();
  const headersList = await headers();
  const subdomainMode = !!headersList.get('x-project-id');

  return (
    <DocsShell projects={projects} subdomainMode={subdomainMode}>
      {children}
    </DocsShell>
  );
}
