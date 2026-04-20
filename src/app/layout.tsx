import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./rehype-styles.css";
import { ThemeProvider } from "@/components/theme-provider";
import { headers } from "next/headers";
import { cn } from "@/lib/utils";

const robotoHeading = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-heading'
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

import { SITE_CONFIG } from "@/config";

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_CONFIG.title}`,
    default: SITE_CONFIG.title,
  },
  description: "Documentación estática generada desde GitHub",
};

import DynamicIcon from '@/components/DynamicIcon';

import { CreditsButton } from "@/components/CreditsButton";
import { LicenseButton } from "@/components/LicenseButton";
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeHydrator } from "@/components/ThemeHydrator";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = 2026;
  const availableThemes = await getAvailableThemes();
  
  // Determine active theme on the server
  const cookieStore = await cookies();
  const themeFromCookie = cookieStore.get("fusiondoc-theme")?.value;
  const activeThemeId = SITE_CONFIG.defaultTheme || themeFromCookie || "default";
  
  const activeThemeData = availableThemes.find(t => t.id === activeThemeId);
  const serverSideStyles = activeThemeData ? activeThemeData.cssContent 
    .replace(/@theme\s+inline\s*{[\s\S]*?}/g, '')
    .replace(/@layer\s+base\s*{[\s\S]*?}/g, '')
    .replace(/@apply\s+[^;]+;/g, '')
    .replace(/@import\s+["'][^"']+["'];/g, '')
    .replace(/@custom-variant\s+[^;]+;/g, '')
    .replace(/@variant\s+[^;]+;/g, '')
    : "";

  // Dynamic font extraction for SSR
  let fontHref = "";
  if (activeThemeData) {
    const fontVars = ['--font-sans', '--font-serif', '--font-mono'];
    const foundFonts = new Set<string>();
    fontVars.forEach(v => {
      const reg = new RegExp(`${v}:\\s*([^;]+);`);
      const match = activeThemeData.cssContent.match(reg);
      if (match && match[1]) {
        const firstFont = match[1].split(',')[0].trim().replace(/['"]/g, '');
        if (firstFont && !['inter', 'roboto', 'geist', 'sans-serif', 'serif', 'monospace'].includes(firstFont.toLowerCase())) {
          foundFonts.add(firstFont);
        }
      }
    });
    if (foundFonts.size > 0) {
      const fontQuery = Array.from(foundFonts)
        .map(f => `family=${f.replace(/\s+/g, '+')}:wght@400;500;700`)
        .join('&');
      fontHref = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    }
  }

  return (
    <html lang="es" className={cn(inter.variable, robotoHeading.variable, "h-full overflow-hidden")} suppressHydrationWarning>
      <head>
        {fontHref && <link id="fusiondoc-dynamic-fonts" rel="stylesheet" href={fontHref} />}
        {activeThemeId !== "default" && (
          <style 
            id="fusiondoc-dynamic-theme" 
            dangerouslySetInnerHTML={{ __html: serverSideStyles }} 
          />
        )}
      </head>
      <body
        className="antialiased h-full overflow-hidden bg-background text-foreground flex flex-col font-sans"
      >
        <ThemeHydrator themes={availableThemes} defaultTheme={SITE_CONFIG.defaultTheme} />
        <ThemeProvider
          attribute="class"
          defaultTheme={SITE_CONFIG.defaultAppearance || "system"}
          forcedTheme={SITE_CONFIG.defaultAppearance || undefined}
          enableSystem={!SITE_CONFIG.defaultAppearance}
          disableTransitionOnChange
        >
          <div
            className="flex flex-col h-full overflow-hidden"
            style={{ '--footer-height': '36px' } as React.CSSProperties}
          >
            <main className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
              {children}
            </main>

            <footer className="shrink-0 bg-background border-t border-border/40 h-9 flex items-center justify-between z-[60] px-4 sm:px-6 relative">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                  FusionDoc <span className="text-primary/40">©</span> {currentYear}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <CreditsButton />
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
