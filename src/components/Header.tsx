import Link from 'next/link';
import { ModeToggle } from "@/components/mode-toggle";
import DynamicIcon from '@/components/DynamicIcon';
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeSelector } from "@/components/ThemeSelector";
import { CodeThemeSelector } from "@/components/CodeThemeSelector";
import { getCodeTheme } from "@/app/actions/code-themes";

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
             <svg xmlns="http://www.w3.org/20urn:schemas-microsoft-com:office:office" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
             Fusiondoc Next
          </Link>
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
          <ThemeSelector themes={availableThemes} />
          <CodeThemeSelector currentTheme={currentCodeTheme} />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

