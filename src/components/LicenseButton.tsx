"use client";

import { Scale, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LicenseButton() {
  const licenseText = `MIT License

Copyright (c) 2026 Jhon Fredy Valencia Gómez (FusionDoc)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          <Scale className="h-3.5 w-3.5" />
          <span>Licencia</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[580px] border-border/50 bg-background/95 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.03] to-transparent pointer-events-none" />
        
        <div className="relative p-7">
          <DialogHeader className="space-y-1 mb-6 text-center items-center">
            <div className="flex items-center gap-2 text-primary/60">
               <ShieldCheck className="h-3.5 w-3.5" />
               <span className="text-[9px] font-black uppercase tracking-[0.4em]">Legal Framework</span>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight font-heading leading-tight">
              TÉRMINOS DE <span className="text-primary italic">LICENCIA</span>
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
              Standard Compliance & Usage Rights
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/40 border border-border/50 group hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner ring-1 ring-primary/20">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-foreground">MIT Open Source</p>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tight opacity-40">Permisiva · Comercial · Privada</p>
                </div>
              </div>
              <Scale className="h-3.5 w-3.5 text-primary/20 group-hover:text-primary transition-colors" />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative">
                 <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none rounded-t-2xl" />
                 <pre className="relative h-[220px] w-full overflow-y-auto rounded-2xl bg-card/60 border border-border/50 p-6 text-[11px] font-mono leading-relaxed text-muted-foreground/80 custom-scrollbar selection:bg-primary/20 whitespace-pre-wrap break-words">
                   {licenseText}
                 </pre>
                 <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none rounded-b-2xl" />
              </div>
            </div>

            <div className="flex items-center justify-center pt-1">
              <a 
                href="https://opensource.org/licenses/MIT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/link text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-all flex items-center gap-2"
              >
                <span>Documentación oficial MIT</span>
                <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 px-8 py-3 bp-border/50 text-[9px] text-center text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">
          FusionDoc Software License Verification v1.0.0
        </div>
      </DialogContent>
    </Dialog>

  );
}
