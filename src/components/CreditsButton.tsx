"use client";

import { Info, User, Mail, Cpu, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CreditsButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Créditos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] border-border/50 bg-background/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.03] pointer-events-none" />
        
        <div className="relative p-7">
          <DialogHeader className="space-y-1 mb-6 text-center items-center">
            <div className="flex items-center gap-2 text-primary/60">
               <Cpu className="h-3.5 w-3.5" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Engineering</span>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight font-heading leading-tight uppercase">
              <span className="text-primary">FUSIONDOC</span>
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-center">
              Arquitectura de Documentación Profesional
            </DialogDescription>
          </DialogHeader>

          <div className="relative group">
            <div className="relative flex flex-col items-center p-8 rounded-[2rem] bg-card border border-border/40 backdrop-blur-md text-center transition-all duration-500">
              <div className="space-y-2">
                <h3 className="font-black text-sm text-foreground tracking-[0.2em] uppercase leading-none transition-colors group-hover:text-primary">
                  Jhon Fredy Valencia Gómez
                </h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                  Arquitectura e Ingeniería de Software
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 px-8 py-3.5 border-t border-border/50 text-[9px] text-center text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
          Núcleo del Sistema FusionDoc v1.0.0 · © 2026
        </div>
      </DialogContent>
    </Dialog>
  );
}
