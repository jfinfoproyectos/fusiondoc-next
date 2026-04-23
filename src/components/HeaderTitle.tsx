"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getEffectiveProject } from '@/lib/version-utils';
import DynamicIcon from '@/components/DynamicIcon';


export default function HeaderTitle({ 
  projects,
  siteConfig
}: { 
  projects: { id: string, name: string }[],
  siteConfig: any
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeVersion = getEffectiveProject(pathname, projects);
  const href = mounted && activeVersion ? `/${activeVersion}` : "/";

  return (
    <Link 
      href={href}
      className={`font-bold text-lg md:text-xl text-primary flex items-center gap-2 shrink-0 ml-2 md:ml-0 group transition-opacity duration-300 ${!mounted ? 'opacity-70' : 'opacity-100'}`}
    >
      <div className={`w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-300 ${!mounted ? '' : ''}`}>
        <DynamicIcon icon={siteConfig.logo} width="18" height="18" />
      </div>
      <span className="hidden sm:inline-block tracking-tighter uppercase font-black">
        {siteConfig.title}
      </span>
    </Link>
  );
}
