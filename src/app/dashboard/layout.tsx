import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Users, LogOut, Settings, LayoutDashboard, Files } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import DashboardNav from "@/features/dashboard/DashboardNav";
import { ConfigControls } from "@/components/ConfigControls";
import { getAvailableThemes } from "@/app/actions/themes";
import { getSiteConfig } from "@/config";
import { DashboardContentWrapper } from "@/features/dashboard/DashboardContentWrapper";
import { getCodeTheme } from "@/app/actions/code-themes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const availableThemes = await getAvailableThemes();
  const siteConfig = await getSiteConfig();

  // If Auth/DB is disabled, redirect to home
  if (!siteConfig.enableAuthDb) {
    redirect("/");
  }

  if (!session) {
    redirect("/signin");
  }

  const isAdmin = session.user.role === "admin";
  const currentCodeTheme = await getCodeTheme();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4 text-background" />
              </div>
              <span className="font-black tracking-tight text-lg">FusionDoc</span>
            </Link>
 
            {/* Nav links - desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard/groups"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Users className="w-4 h-4" />
                Grupos
              </Link>
              <Link
                href="/dashboard/docs"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Files className="w-4 h-4" />
                Documentación
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-2 ml-auto">
                <div className="mr-1">
                  <ConfigControls 
                    availableThemes={availableThemes} 
                    currentCodeTheme={currentCodeTheme} 
                    siteConfig={siteConfig} 
                  />
                </div>
               {/* User menu */}
               <DashboardNav user={session.user} isAdmin={isAdmin} themes={availableThemes} siteConfig={siteConfig} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <DashboardContentWrapper>
        {children}
      </DashboardContentWrapper>
    </div>
  );
}
