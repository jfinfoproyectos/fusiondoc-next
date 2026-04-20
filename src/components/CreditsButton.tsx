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
            <DialogTitle className="text-2xl font-black tracking-tight font-heading leading-tight">
              SISTEMA <span className="text-primary italic">FUSIONDOC</span>
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold opacity-30 uppercase tracking-widest text-center">
              Professional Documentation Architecture
            </DialogDescription>
          </DialogHeader>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative flex flex-col items-center p-7 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-md text-center shadow-sm group-hover:bg-card/60 transition-all duration-500">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-primary/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                <User className="h-10 w-10" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-black text-xl text-foreground tracking-tight leading-none transition-colors group-hover:text-primary">
                  Jhon Fredy Valencia Gómez
                </h3>
                <p className="text-[10px] font-black text-primary/70 uppercase tracking-[0.2em]">
                  Ingeniero de Desarrollo de Software
                </p>
              </div>

              <div className="mt-7 pt-6 border-t border-border/50 w-full flex justify-center">
                <a 
                  href="mailto:fusiondocv1@gmail.com"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all group/mail shadow-sm"
                >
                  <Mail className="h-3 w-3 text-primary/60 group-hover/mail:scale-110 transition-transform" />
                  <span>fusiondocv1@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 px-8 py-3.5 border-t border-border/50 text-[9px] text-center text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
          FusionDoc System Core v1.0.0 · © 2026
        </div>
      </DialogContent>
    </Dialog>
  );
}
