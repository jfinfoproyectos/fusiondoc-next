import Link from 'next/link';
import { ModeToggle } from "@/components/mode-toggle";
import DynamicIcon from '@/components/DynamicIcon';
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CodeThemeSelector } from "@/components/CodeThemeSelector";
import { getCodeTheme } from "@/app/actions/code-themes";
import { SITE_CONFIG } from '@/config';
import { Search } from './Search';
import VersionSelector from './VersionSelector';
import MobileNav from './MobileNav';
import MobileConfig from './MobileConfig';

export default async function Header() {
  let socialLinks: { name: string; url: string; icon: string }[] = [];
  
  try {
    if (process.env.SOCIAL_LINKS) {
      socialLinks = JSON.parse(process.env.SOCIAL_LINKS);
    }
  } catch (error) {
    console.error("Error parsing SOCIAL_LINKS env var:", error);
  }

  const availableThemes = await getAvailableThemes();
  const currentCodeTheme = await getCodeTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background h-16 flex items-center">
      <div className="flex items-center w-full max-w-[1700px] mx-auto px-4 md:px-6 gap-2 md:gap-4">
        {/* Left: Menu burger (mobile only) + Logo + Version */}
        <div className="flex items-center">
          {/* Hamburger: visible < md, hidden >= md */}
          <div className="mobile-only items-center">
            <MobileNav />
          </div>
          <Link href="/" className="font-bold text-lg md:text-xl text-primary flex items-center gap-2 shrink-0">
             <DynamicIcon icon={SITE_CONFIG.logo} width="22" height="22" />
             <span className="hidden sm:inline-block">{SITE_CONFIG.title}</span>
          </Link>
          <div className="hidden md:block ml-4">
            <VersionSelector />
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-sm mx-2 md:mx-4">
           <Search />
        </div>

        {/* Right: Social links + Config buttons */}
        <div className="flex items-center ml-auto gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-4">
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

          <div className="flex items-center gap-2">
            {/* Unified config: mobile only (< md) */}
            <div className="mobile-only items-center">
              <MobileConfig themes={availableThemes} currentCodeTheme={currentCodeTheme} />
            </div>
            
            {/* Individual selectors: desktop only (>= md) */}
            <div className="desktop-only items-center gap-2">
              <ThemeSelector themes={availableThemes} forcedTheme={SITE_CONFIG.defaultTheme} />
              {!SITE_CONFIG.defaultCodeTheme && (
                <CodeThemeSelector currentTheme={currentCodeTheme} />
              )}
              {!SITE_CONFIG.defaultAppearance && (
                <ModeToggle />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

