'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GITHUB_CONFIG } from '@/config';
import { getVersionFromPath, getRelativePath } from '@/lib/version-utils';
import { ChevronDown, Layers } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VersionSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const versions = GITHUB_CONFIG.versions;
  
  if (versions.length <= 1) return null;

  const currentVersionConfig = GITHUB_CONFIG.versions.find(v => v.id === (getVersionFromPath(pathname) || GITHUB_CONFIG.versions[0].id)) || GITHUB_CONFIG.versions[0];
  const currentVersion = currentVersionConfig.id;
  const relativePath = getRelativePath(pathname);

  const handleVersionChange = (version: string) => {
    if (version === currentVersion) return;
    // Construir la nueva ruta manteniendo el path relativo si es posible
    const newPath = `/${version}/${relativePath}`.replace(/\/$/, '');
    router.push(newPath || `/${version}`);
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-bold transition-all rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 group ml-2 shrink-0">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground group-hover:text-primary transition-colors uppercase tracking-wider">{currentVersionConfig.name || currentVersion}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 p-1 bg-background/95 backdrop-blur-md border-border/60 shadow-xl rounded-xl z-[100]">
          {versions.map((version) => (
            <DropdownMenuItem
              key={version.id}
              onClick={() => handleVersionChange(version.id)}
              className={`flex items-start justify-between px-3 py-2.5 cursor-pointer rounded-lg transition-colors mb-0.5 last:mb-0 ${
                version.id === currentVersion 
                  ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/15' 
                  : 'hover:bg-accent focus:bg-accent'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold uppercase tracking-wide">{version.name || version.id}</span>
                {version.description && (
                  <span className="text-[10px] text-muted-foreground font-normal line-clamp-1">{version.description}</span>
                )}
              </div>
              {version.id === currentVersion && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] mt-1.5" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
