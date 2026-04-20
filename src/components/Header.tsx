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
import { SITE_CONFIG } from '@/config';

export default async function Header({ 
  projects, 
  subdomainMode 
}: { 
  projects: { id: string, name: string }[], 
  subdomainMode: boolean 
}) {
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
        {/* Left Section: Logo & Mobile Nav */}
        <div className="flex items-center shrink-0">
          <div className="mobile-only items-center">
            <MobileNav projects={projects} subdomainMode={subdomainMode} />
          </div>
          <HeaderTitle projects={projects} />
        </div>

        {/* Center Section: Spacer (pushes everything to the right) */}
        <div className="flex-1" />

        {/* Right Section: Search, Social, Config */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Search Bar - hidden on mobile, visible on sm+ */}
          <div className="hidden sm:block w-48 md:w-56 lg:w-72">
            <Search projects={projects} subdomainMode={subdomainMode} />
          </div>

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
          <div className="flex items-center gap-2">
            <div className="mobile-only items-center">
              <MobileConfig themes={availableThemes} currentCodeTheme={currentCodeTheme} />
            </div>
            
            <div className="desktop-only items-center gap-1.5">
              {!SITE_CONFIG.defaultTheme && (
                <ThemeSelector themes={availableThemes} defaultTheme={SITE_CONFIG.defaultTheme} />
              )}
              {!SITE_CONFIG.defaultCodeTheme && (
                <CodeThemeSelector currentTheme={currentCodeTheme} />
              )}
              {!SITE_CONFIG.defaultAppearance && <ModeToggle />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
