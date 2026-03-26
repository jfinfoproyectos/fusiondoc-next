import { getNavigation } from '@/lib/github';
import SidebarNav from './SidebarNav';

export default async function Sidebar() {
  const navItems = await getNavigation();

  return (
    <aside className="w-64 border-r border-border h-[calc(100vh-4rem)] bg-muted/40 sticky top-16 overflow-y-auto hidden md:block">
      <SidebarNav navItems={navItems} />
    </aside>
  );
}
