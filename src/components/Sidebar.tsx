'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SidebarNav from './SidebarNav';
import { NavGroup } from '@/lib/github';
import { Loader2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Extract topic from the first part of the slug in the URL
  // We exclude common landing pages if any
  const getActiveTopic = () => {
     const parts = pathname.split('/').filter(Boolean);
     return parts.length > 0 ? parts[0] : undefined;
  };

  const activeTopic = getActiveTopic();

  useEffect(() => {
    let isMounted = true;
    
    async function loadNavigation() {
      if (!activeTopic) {
        setNavItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/nav?topic=${activeTopic}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) {
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
  }, [activeTopic]);

  return (
    <aside className="w-64 border-r border-border h-[calc(100vh-6.5rem)] bg-muted/40 sticky top-26 overflow-hidden hidden md:block">
      {loading && navItems.length === 0 ? (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary/40" />
        </div>
      ) : error ? (
        <div className="p-4 text-xs text-red-500/60 bg-red-500/5 m-4 rounded-xl border border-red-500/10">
          Error al cargar navegación de {activeTopic}.
        </div>
      ) : (
        <SidebarNav navItems={navItems} />
      )}
    </aside>
  );
}
