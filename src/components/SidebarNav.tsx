"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useRef } from 'react';
import { NavGroup } from '@/lib/github';
import { ChevronDown, ChevronRight, FoldVertical, UnfoldVertical, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import DynamicIcon from '@/components/DynamicIcon';

export default function SidebarNav({ navItems }: { navItems: NavGroup[] }) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const lastPathRef = useRef<string>('');

  // Initialize expanded groups based on current path ONLY when the path actually changes
  useEffect(() => {
    // Scroll to the top of the page when the pathname changes
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Also try to scroll the document wrapper if it exists and uses its own scrollbar
    const mainScrollArea = document.querySelector('main, .overflow-y-auto');
    if (mainScrollArea) {
       mainScrollArea.scrollTo({ top: 0, behavior: 'instant' });
    }

    // If we've already processed this path, don't re-trigger (allows manual closing)
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    const initial: Record<string, boolean> = {};
    let changed = false;
    
    navItems.forEach(group => {
      const hasActiveLink = group.links.some(link => pathname === link.href);
      if (hasActiveLink) {
        initial[group.title] = true;
        changed = true;
      }
    });

    if (changed) {
      setExpandedGroups(prev => ({ ...prev, ...initial }));
    }
  }, [navItems, pathname]);


  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    navItems.forEach(group => {
      allExpanded[group.title] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  if (!navItems || navItems.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No se encontraron documentos en este tópico.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sidebar Toolbar */}
      <div className="p-4 py-2 border-b border-border/10 flex items-center justify-between bg-white/[0.02]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">Navegación</span>
        <div className="flex items-center gap-1">
          <button 
            onClick={expandAll}
            className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            title="Expandir todo"
          >
            <UnfoldVertical size={14} />
          </button>
          <button 
            onClick={collapseAll}
            className="p-1.5 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
            title="Colapsar todo"
          >
            <FoldVertical size={14} />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {navItems.map((group, index) => {
          const isExpanded = expandedGroups[group.title];
          
          return (
            <div key={`${group.title}-${index}`} className="flex flex-col">
              <div className="flex items-center justify-between group/cat">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex-1 flex items-center py-2 text-sm font-bold text-foreground/80 hover:text-primary transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: isExpanded ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} className="text-muted-foreground/40 shrink-0" />
                    </motion.div>
                    {group.icon && <DynamicIcon icon={group.icon} width="16" height="16" className="text-muted-foreground/70 shrink-0" />}
                    <span className="tracking-tight">{group.title}</span>
                  </span>
                </button>
                {group.indexHref && (
                  <Link
                    href={group.indexHref}
                    scroll={false}
                    title="Ir a la categoría"
                    className="p-1.5 text-muted-foreground/40 hover:text-primary hover:bg-primary/5 rounded-md opacity-0 group-hover/cat:opacity-100 focus:opacity-100 transition-all"
                  >
                    <LayoutGrid size={13} />
                  </Link>
                )}
              </div>
              
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden space-y-1 ml-4 border-l border-white/5 pl-2 mt-1"
                  >
                    {group.links.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            scroll={false}
                            className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg transition-all group/link ${
                              isActive 
                                ? 'bg-primary/10 text-primary font-bold' 
                                : 'text-muted-foreground/70 hover:text-foreground hover:bg-white/5'
                            }`}
                          >
                            {link.icon && <DynamicIcon icon={link.icon} width="14" height="14" className={cn("shrink-0", isActive ? "text-primary" : "text-muted-foreground/40 group-hover/link:text-foreground/60")} />}
                            <span className="tracking-tight leading-tight">{link.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
