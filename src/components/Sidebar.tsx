'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SidebarNav from './SidebarNav';
import { NavGroup } from '@/lib/github';
import { Loader2 } from 'lucide-react';
import { getEffectiveProject, getTopicFromPath } from '@/lib/version-utils';

export default function Sidebar({ 
  projects, 
  subdomainMode 
}: { 
  projects: { id: string, name: string }[], 
  subdomainMode: boolean 
}) {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const activeVersion = getEffectiveProject(pathname, projects);
  const activeTopic = getTopicFromPath(pathname, projects);

  const lastTopicRef = React.useRef<string | undefined>(undefined);
  const lastVersionRef = React.useRef<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    
    // Si el tópico y la versión son iguales a los ya cargados, no hacer nada.
    // Esto evita que el sidebar "parpadee" o se recargue al navegar entre páginas del mismo tópico.
    if (activeTopic === lastTopicRef.current && activeVersion === lastVersionRef.current) {
      setLoading(false);
      return;
    }

    async function loadNavigation() {
      if (!activeTopic) {
        setNavItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = `/api/nav?topic=${activeTopic || ''}${activeVersion ? `&version=${activeVersion}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        if (isMounted) {
          lastTopicRef.current = activeTopic;
          lastVersionRef.current = activeVersion;
          setNavItems(data.navItems || []);
          setError(false);
        }
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNavigation();
    return () => { isMounted = false; };
  }, [activeTopic, activeVersion]);

  return (
    <aside className="w-64 border-r border-border h-full bg-muted/40 overflow-hidden hidden md:block">
      {loading && navItems.length === 0 ? (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary/40" />
        </div>
      ) : error ? (
        <div className="p-4 text-xs text-red-500/60 bg-red-500/5 m-4 rounded-xl border border-red-500/10">
          Error al cargar navegación de {activeTopic || 'general'}.
        </div>
      ) : (
        <SidebarNav 
          navItems={navItems} 
          projectId={activeVersion} 
          subdomainMode={subdomainMode} 
        />
      )}
    </aside>
  );
}
