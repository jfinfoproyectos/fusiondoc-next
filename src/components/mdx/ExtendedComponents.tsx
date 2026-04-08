'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

// --- BentoGrid ---

export function BentoGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 my-8", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ 
  title, 
  description, 
  icon, 
  className,
  children 
}: { 
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/[0.08] hover:shadow-2xl hover:border-white/20",
      className
    )}>
      <div>
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors tracking-tight">{title}</h3>
        {description && <p className="text-muted-foreground/80 text-sm leading-relaxed">{description}</p>}
      </div>
      
      {children && <div className="mt-6">{children}</div>}

      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

// --- Timeline ---

interface TimelineItemProps {
  title: string;
  date?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-16 ml-6 border-l border-white/10 space-y-16">
      {children}
    </div>
  );
}

export function TimelineItem({ title, date, children, variant = 'default' }: TimelineItemProps) {
  const dotStyles = {
    default: "bg-primary shadow-[0_0_15px_rgba(255,255,255,0.2)]", // Fallback if primary-rgb not defined
    success: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]",
    warning: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]",
    error: "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]",
  };

  return (
    <div className="relative pl-12 group">
      <div className={cn(
        "absolute left-[-6px] top-1.5 h-3 w-3 rounded-full outline outline-8 outline-background ring-2 ring-white/10 transition-all duration-500 group-hover:scale-150",
        dotStyles[variant]
      )} />
      
      <div className="flex flex-col gap-2">
        {date && <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none mb-1 opacity-70">{date}</span>}
        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{title}</h3>
        <div className="mt-3 text-muted-foreground/90 text-sm leading-relaxed prose-sm prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
