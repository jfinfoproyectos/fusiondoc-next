"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Shield, User, Menu, X, Users, LayoutDashboard, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/mode-toggle";
import { CreditsButton } from "@/components/CreditsButton";
import { ThemeSelector, ThemeInfo } from "@/components/ThemeSelector";


interface DashboardNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
  isAdmin: boolean;
  themes: ThemeInfo[];
  siteConfig: any;
}

function getInitials(name: string) {
  if (!name) return "??";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function DashboardNav({ user, isAdmin, themes, siteConfig }: DashboardNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/signin");
  };

  return (
    <>
      {/* Desktop user dropdown */}
      <div className="hidden md:flex items-center gap-3">
        {isAdmin && (
          <Badge variant="outline" className="gap-1.5 text-xs font-bold uppercase tracking-wider border-foreground/20">
            <Shield className="w-3 h-3" />
            Admin
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback className="bg-foreground text-background text-xs font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/groups" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Mis Grupos
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2 font-bold text-primary">
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile: hamburger menu */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
        onClick={() => setMobileMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background border-l border-border shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="bg-foreground text-background text-sm font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded hover:bg-muted/50">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAdmin && (
              <Badge className="w-fit mb-6 gap-1.5 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                Administrador
              </Badge>
            )}

            <nav className="flex flex-col gap-1 flex-1">
              <Link
                href="/dashboard/groups"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="w-4 h-4" />
                Grupos
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4 px-3 py-4 border-t border-border/50 mt-auto">
              <div className="flex items-center gap-2">
                <ThemeSelector themes={themes} defaultTheme={siteConfig.defaultTheme} />
                <ModeToggle />
              </div>
              <div className="flex flex-col ml-1">
                <span className="text-xs font-bold text-foreground">Apariencia</span>
                <span className="text-[10px] text-muted-foreground">Colores y modo</span>
              </div>
            </div>



            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-4"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}
