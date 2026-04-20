"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  Settings2, 
  Palette, 
  Code2, 
  Sun, 
  Moon, 
  Check, 
  Loader2,
  ChevronRight,
  Monitor
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ThemeInfo } from "./ThemeSelector";
import { setCodeTheme } from "@/app/actions/code-themes";
import { cn } from "@/lib/utils";

import { SITE_CONFIG } from "@/config";

const SHIKI_THEMES = [
  { id: "github-dark", name: "GitHub Dark" },
  { id: "github-light", name: "GitHub Light" },
  { id: "dracula", name: "Dracula" },
  { id: "nord", name: "Nord" },
  { id: "tokyo-night", name: "Tokyo Night" },
  { id: "night-owl", name: "Night Owl" },
  { id: "ayu-dark", name: "Ayu Dark" },
  { id: "one-dark-pro", name: "One Dark Pro" },
  { id: "monokai", name: "Monokai" },
  { id: "vesper", name: "Vesper" },
  { id: "rose-pine", name: "Rosé Pine" },
];

interface MobileConfigProps {
  themes: ThemeInfo[];
  currentCodeTheme: string;
}

export default function MobileConfig({ themes, currentCodeTheme }: MobileConfigProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [activeCodeTheme, setActiveCodeTheme] = useState(currentCodeTheme);
  const [activeTheme, setActiveTheme] = useState<string>("default");

  useEffect(() => {
    setMounted(true);
    const savedTheme = SITE_CONFIG.defaultTheme || localStorage.getItem("fusiondoc-theme") || "default";
    setActiveTheme(savedTheme);
  }, []);

  // Update localStorage and notify hydrator on change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fusiondoc-theme", activeTheme);
    window.dispatchEvent(new CustomEvent("fusiondoc-theme-change", { detail: activeTheme }));
  }, [activeTheme, mounted]);

  const handleCodeThemeChange = (themeId: string) => {
    setActiveCodeTheme(themeId);
    startTransition(async () => {
      await setCodeTheme(themeId);
    });
  };

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0" title="Configurar Apariencia">
          <Settings2 className="h-5 w-5" />
          <span className="sr-only">Ajustes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Configuración Local</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* MODO (LIGHT/DARK) - Hidden if default appearance exists */}
        {!SITE_CONFIG.defaultAppearance && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>Apariencia</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[120px]">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2"><Sun className="w-4 h-4" /><span>Claro</span></div>
                  {theme === "light" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2"><Moon className="w-4 h-4" /><span>Oscuro</span></div>
                  {theme === "dark" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2"><Monitor className="w-4 h-4" /><span>Sistema</span></div>
                  {theme === "system" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

        {/* ESTILO VISUAL (COLORES) - Hidden if default UI theme exists */}
        {!SITE_CONFIG.defaultTheme && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
              <Palette className="w-4 h-4" />
              <span>Estilo Visual</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[160px] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem onClick={() => setActiveTheme("default")} className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    <span>Predeterminado</span>
                  </div>
                  {activeTheme === "default" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
                {themes.map((t) => (
                  <DropdownMenuItem key={t.id} onClick={() => setActiveTheme(t.id)} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: t.primaryColor }} />
                      <span>{t.name}</span>
                    </div>
                    {activeTheme === t.id && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

        {/* TEMA DE CÓDIGO - Hidden if default code theme exists */}
        {!SITE_CONFIG.defaultCodeTheme && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Code2 className="w-4 h-4" />}
              <span>Tema de Código</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[180px] max-h-[350px] overflow-y-auto">
                {SHIKI_THEMES.map((st) => (
                  <DropdownMenuItem key={st.id} onClick={() => handleCodeThemeChange(st.id)} className="flex items-center justify-between cursor-pointer">
                    <span className={cn(activeCodeTheme === st.id ? "font-bold text-primary" : "")}>{st.name}</span>
                    {activeCodeTheme === st.id && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
