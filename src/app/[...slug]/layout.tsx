import { getAvailableProjects } from '@/lib/github';
import DocsShell from '@/components/DocsShell';
import { headers } from 'next/headers';
import { GitHubErrorModal } from '@/components/GitHubErrorModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function SlugLayout({ children }: LayoutProps) {
  const { projects, error } = await getAvailableProjects();
  const headersList = await headers();
  const subdomainMode = !!headersList.get('x-project-id');

  return (
    <>
      <GitHubErrorModal errorType={error} />
      <DocsShell projects={projects} subdomainMode={subdomainMode}>
        {children}
      </DocsShell>
    </>
  );
}
