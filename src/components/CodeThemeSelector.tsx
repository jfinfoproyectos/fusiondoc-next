"use client";

import { useState, useTransition } from "react";
import { Code2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { setCodeTheme } from "@/app/actions/code-themes";
import { cn } from "@/lib/utils";

const SHIKI_THEMES = [
  { id: "github-dark", name: "GitHub Dark" },
  { id: "github-light", name: "GitHub Light" },
  { id: "nord", name: "Nord" },
  { id: "dracula", name: "Dracula" },
  { id: "monokai", name: "Monokai" },
  { id: "vesper", name: "Vesper" },
  { id: "rose-pine", name: "Rosé Pine" },
  { id: "one-dark-pro", name: "One Dark Pro" },
  { id: "min-dark", name: "Min Dark" },
  { id: "min-light", name: "Min Light" },
];

interface CodeThemeSelectorProps {
  currentTheme: string;
}

export function CodeThemeSelector({ currentTheme }: CodeThemeSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTheme, setActiveTheme] = useState(currentTheme);

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    startTransition(async () => {
      await setCodeTheme(themeId);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0 relative" 
          title="Tema de Código"
          disabled={isPending}
        >
           {isPending ? (
             <Loader2 className="h-[1.1rem] w-[1.1rem] animate-spin text-primary" />
           ) : (
             <Code2 className="h-[1.1rem] w-[1.1rem] transition-all" />
           )}
           <span className="sr-only">Seleccionar Tema de Código</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px] max-h-[400px] overflow-y-auto overflow-x-hidden">
        <DropdownMenuLabel>Estilo de Código</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {SHIKI_THEMES.map((theme) => (
          <DropdownMenuItem 
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-1.5 h-3 rounded-full",
                  theme.id.includes("light") ? "bg-slate-300" : "bg-slate-800"
                )}
              />
              <span className={cn(
                activeTheme === theme.id ? "font-bold text-primary" : ""
              )}>
                {theme.name}
              </span>
            </div>
            {activeTheme === theme.id && <Check className="w-4 h-4 ml-2 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
