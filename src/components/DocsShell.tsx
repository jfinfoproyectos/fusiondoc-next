import React from 'react';
import Header from "@/components/Header";
import TopicsBar from "@/components/TopicsBar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/config";

interface DocsShellProps {
  children: React.ReactNode;
  projects: { id: string, name: string }[];
  subdomainMode: boolean;
}

export default function DocsShell({ children, projects, subdomainMode }: DocsShellProps) {
  const hasFooter = true; // El footer es ahora permanente en el layout global
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header projects={projects} subdomainMode={subdomainMode} />
      <TopicsBar projects={projects} subdomainMode={subdomainMode} />
      
      <div className="flex flex-1 w-full max-w-[1700px] mx-auto relative overflow-hidden">
        {/* Sidebar maintains its own scroll logic inside */}
        <Sidebar projects={projects} subdomainMode={subdomainMode} />
        
        {/* Main container with no scroll - children will scroll themselves */}
        <main className={cn("flex-1 w-full min-w-0 flex flex-row", hasFooter && "pb-12")}>
          {children}
        </main>
      </div>
    </div>
  );
}
