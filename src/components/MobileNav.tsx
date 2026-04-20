'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SidebarNav from './SidebarNav';
import { NavGroup } from '@/lib/github';
import { getEffectiveProject, getTopicFromPath } from '@/lib/version-utils';
import { SITE_CONFIG } from '@/config';
import DynamicIcon from './DynamicIcon';
import Link from 'next/link';

export default function MobileNav({ 
  projects, 
  subdomainMode 
}: { 
  projects: { id: string, name: string }[], 
  subdomainMode: boolean 
}) {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const activeVersion = getEffectiveProject(pathname, projects);
  const activeTopic = getTopicFromPath(pathname, projects);

  // Cargar navegación cuando se abre el menú o cambia el tópico
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    
    async function loadNavigation() {
      if (!activeTopic) {
        setNavItems([]);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/nav?topic=${activeTopic}${activeVersion ? `&version=${activeVersion}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) {
          setNavItems(data.navItems || []);
        }
      } catch (err) {
        console.error("Error loading mobile nav:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNavigation();
    return () => { isMounted = false; };
  }, [activeTopic, activeVersion, open]);

  // Cerrar el menú automáticamente al cambiar de ruta
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col w-[280px]">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle>
            <Link href="/" className="flex items-center gap-2 font-bold text-primary">
              <DynamicIcon icon={SITE_CONFIG.logo} width="20" height="20" />
              {SITE_CONFIG.title}
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden">
          {!activeTopic ? (
             <div className="p-6 text-center text-sm text-muted-foreground">
               Selecciona un tópico para ver la navegación.
             </div>
          ) : (
            <SidebarNav navItems={navItems} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
