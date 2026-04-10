import Link from 'next/link';
import { ModeToggle } from "@/components/mode-toggle";
import DynamicIcon from '@/components/DynamicIcon';
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CodeThemeSelector } from "@/components/CodeThemeSelector";
import { getCodeTheme } from "@/app/actions/code-themes";
import { SITE_CONFIG } from '@/config';
import { Search } from './Search';

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
      <div className="flex items-center w-full max-w-[1700px] mx-auto px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl text-primary flex items-center gap-2">
             <DynamicIcon icon={SITE_CONFIG.logo} width="24" height="24" />
             {SITE_CONFIG.title}
          </Link>
        </div>

        <div className="flex-1 max-w-sm mx-4 md:mx-8">
           <Search />
        </div>
        <div className="flex items-center ml-auto gap-4 text-sm font-medium">
          {socialLinks.map((link, i) => {
            return (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title={link.name}
              >
                <DynamicIcon icon={link.icon} width="20" height="20" />
                <span className="sr-only">{link.name}</span>
              </a>
            );
          })}
          <ThemeSelector themes={availableThemes} forcedTheme={SITE_CONFIG.defaultTheme} />
          {!SITE_CONFIG.defaultCodeTheme && (
            <CodeThemeSelector currentTheme={currentCodeTheme} />
          )}
          {!SITE_CONFIG.defaultAppearance && (
            <ModeToggle />
          )}
        </div>
      </div>
    </header>
  );
}

