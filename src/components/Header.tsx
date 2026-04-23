import { ModeToggle } from "@/components/mode-toggle";
import DynamicIcon from '@/components/DynamicIcon';
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CodeThemeSelector } from "@/components/CodeThemeSelector";
import { getCodeTheme } from "@/app/actions/code-themes";
import Search from './Search';
import MobileNav from './MobileNav';
import MobileConfig from './MobileConfig';
import HeaderTitle from './HeaderTitle';
import { CreditsButton } from './CreditsButton';
import { getSiteConfig } from '@/config';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { ConfigControls } from './ConfigControls';

export default async function Header({ 
  projects, 
  subdomainMode 
}: { 
  projects: { id: string, name: string }[], 
  subdomainMode: boolean 
}) {
  const siteConfig = await getSiteConfig();
  let socialLinks: { name: string; url: string; icon: string }[] = siteConfig.socialLinks || [];

  const availableThemes = await getAvailableThemes();
  const currentCodeTheme = await getCodeTheme();
  const session = await auth.api.getSession({ headers: await headers() });
  const isAuthenticated = !!session;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background h-16 flex items-center">
      <div className="flex items-center w-full max-w-[1700px] mx-auto px-4 md:px-6 gap-2 md:gap-4">
        {/* Left Section: Logo & Mobile Nav */}
        <div className="flex items-center shrink-0">
          <div className="mobile-only items-center">
            <MobileNav projects={projects} subdomainMode={subdomainMode} siteConfig={siteConfig} />
          </div>
          <HeaderTitle projects={projects} siteConfig={siteConfig} />
        </div>

        {/* Center Section: Spacer (pushes everything to the right) */}
        <div className="flex-1" />

        {/* Right Section: Search, Social, Config */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Search Bar - hidden on mobile, visible on sm+ */}
          <div className="hidden sm:block w-48 md:w-56 lg:w-72">
            <Search projects={projects} subdomainMode={subdomainMode} />
          </div>

          {/* Volver al Panel - Only for authenticated users */}
          {isAuthenticated && (
            <Link 
              href="/dashboard/groups" 
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all font-bold text-sm border border-primary/20"
              title="Volver al Panel"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Panel</span>
            </Link>
          )}

          {/* Social Links - visible only on large screens */}
          {socialLinks.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 px-2 border-r border-border/40">
              {socialLinks.map((link, i) => (
                <a 
                  key={i} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  title={link.name}
                >
                  <DynamicIcon icon={link.icon} width="18" height="18" />
                </a>
              ))}
            </div>
          )}

          {/* Configuration Controls */}
          <ConfigControls 
            availableThemes={availableThemes} 
            currentCodeTheme={currentCodeTheme} 
            siteConfig={siteConfig} 
          />
        </div>
      </div>
    </header>
  );
}
