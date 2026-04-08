'use client';

import React, { useState } from 'react';
import { Play, Code, Monitor, Smartphone, Tablet, Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Assuming standard Shadcn tabs or custom
import { motion, AnimatePresence } from 'framer-motion';

// Simple fallback Tabs if shadcn/ui is not available or customized
const CustomTabs = ({ children, defaultValue }: { children: React.ReactNode, defaultValue: string }) => {
  const [active, setActive] = useState(defaultValue);
  return (
    <div className="flex flex-col h-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
        }
        return child;
      })}
    </div>
  );
};

export function LivePreview({ 
  children, 
  code, 
  title = "Ejemplo en Vivo",
  height = "auto" 
}: { 
  children: React.ReactNode; 
  code?: string; 
  title?: string;
  height?: string | number;
}) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-10 overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-xs font-medium text-muted-foreground ml-2 tracking-wide uppercase">{title}</span>
        </div>
        
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setView('preview')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              view === 'preview' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Monitor className="w-3.5 h-3.5" />
            Vista Previa
          </button>
          <button
            onClick={() => setView('code')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              view === 'code' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code className="w-3.5 h-3.5" />
            Código
          </button>
        </div>
      </div>

      <div className="relative min-h-[200px]" style={{ height }}>
        <AnimatePresence mode="wait">
          {view === 'preview' ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 flex items-center justify-center bg-dot-pattern"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative h-full"
            >
              <div className="absolute right-4 top-4 z-20">
                <button 
                  onClick={copyCode}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="p-6 m-0 bg-transparent font-mono text-sm overflow-x-auto selection:bg-primary/30">
                <code className="text-blue-300">
                  {code || "// No hay vista de código disponible"}
                </code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Meta (Optional) */}
      <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
            <span>Responsive</span>
            <span>Interactive</span>
            <span>Premium</span>
         </div>
         <a href="#" className="text-[10px] flex items-center gap-1 font-bold text-primary/70 hover:text-primary transition-colors uppercase tracking-widest">
            Abrir en Playground <ExternalLink className="w-3 h-3" />
         </a>
      </div>
    </div>
  );
}
