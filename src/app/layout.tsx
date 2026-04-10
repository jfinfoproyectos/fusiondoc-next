import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./rehype-styles.css";
import Header from "@/components/Header";
import TopicsBar from "@/components/TopicsBar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasFooter = !!SITE_CONFIG.footer || SITE_CONFIG.footerLinks.length > 0;

  return (
    <html lang="es" className={cn(inter.variable, robotoHeading.variable)} suppressHydrationWarning>
      <body
        className="antialiased min-h-screen bg-background text-foreground flex flex-col font-sans"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme={SITE_CONFIG.defaultAppearance || "system"}
          enableSystem={!SITE_CONFIG.defaultAppearance}
          forcedTheme={SITE_CONFIG.defaultAppearance || undefined}
          disableTransitionOnChange
        >
          <div 
            className="flex flex-col min-h-screen relative"
            style={{ '--footer-height': hasFooter ? '36px' : '0px' } as React.CSSProperties}
          >
            <Header />
            <TopicsBar />
            <div className="flex flex-1 max-w-[1700px] mx-auto w-full relative">
              <Sidebar />
              <main className={cn("flex-1 w-full min-w-0 py-4 md:py-6 px-0", hasFooter && "pb-12")}>
                {children}
              </main>
              {/* Note: RightSidebar is rendered inside the page routes if needed, 
                  but we'll ensure height consistency in its component */}
            </div>
            
            {hasFooter && (
              <footer className="fixed bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-t border-border h-9 flex items-center justify-center gap-4 text-xs text-muted-foreground z-[60] px-4">
                {SITE_CONFIG.footer && <span>{SITE_CONFIG.footer}</span>}
                {SITE_CONFIG.footerLinks.length > 0 && (
                  <div className={cn("flex items-center gap-3", SITE_CONFIG.footer && "border-l border-border pl-4")}>
                    {SITE_CONFIG.footerLinks.map((link, i) => (
                      <a 
                        key={i} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-foreground transition-colors"
                        title={link.name}
                      >
                        <DynamicIcon icon={link.icon} width="14" height="14" />
                      </a>
                    ))}
                  </div>
                )}
              </footer>
            )}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
