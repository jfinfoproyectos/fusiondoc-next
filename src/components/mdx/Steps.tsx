"use client"

import React from "react";

/**
 * Contenedor principal para una lista de pasos.
 * Proporciona el sistema de numeración automática y la línea vertical decorativa.
 */
export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="steps-container my-12 ml-4 md:ml-6 pl-8 border-l border-slate-200 dark:border-white/10 space-y-12 [counter-reset:step-counter]">
      {children}
      <style jsx>{`
        .steps-container {
          position: relative;
        }
      `}</style>
    </div>
  );
}

/**
 * Representa un paso individual dentro del contenedor Steps.
 */
export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative group animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Círculo indicador con número automático */}
      <div className="absolute -left-[3.15rem] top-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1e293b] text-primary font-black border border-slate-200 dark:border-white/10 shrink-0 shadow-lg group-hover:border-primary/50 transition-all [counter-increment:step-counter] before:content-[counter(step-counter)] text-sm">
      </div>
      
      <div className="pt-1">
        {title && (
          <h3 className="text-lg md:text-xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white/90 group-hover:text-black dark:group-hover:text-white transition-colors">
            {title}
          </h3>
        )}
        <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert prose-blue max-w-none text-slate-600 dark:text-white/70 leading-relaxed overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
