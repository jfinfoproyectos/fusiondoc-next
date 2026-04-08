'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  FileText, 
  Folder, 
  Book, 
  Layers, 
  Rocket, 
  Zap, 
  Layout, 
  Eye, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import DynamicIcon from '@/components/DynamicIcon';

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
}

interface NavigationGridProps {
  items: NavigationItem[];
}

// Mapa de iconos basado en palabras clave o slugs (Fallback)
const getIcon = (title: string, href: string) => {
  const t = title.toLowerCase();
  const h = href.toLowerCase();
  
  if (t.includes('comenzar') || t.includes('introducción') || t.includes('inicio')) return <Rocket className="w-6 h-6 text-blue-500" />;
  if (t.includes('fundamento') || t.includes('base')) return <Book className="w-6 h-6 text-purple-500" />;
  if (t.includes('componente') || t.includes('interactivo')) return <Layers className="w-6 h-6 text-orange-500" />;
  if (t.includes('diseño') || t.includes('layout')) return <Layout className="w-6 h-6 text-emerald-500" />;
  if (t.includes('visualización') || t.includes('mirada')) return <Eye className="w-6 h-6 text-cyan-500" />;
  if (t.includes('configuración') || t.includes('setup')) return <Settings className="w-6 h-6 text-slate-500" />;
  if (t.includes('seo') || t.includes('despliegue')) return <Zap className="w-6 h-6 text-yellow-500" />;
  if (t.includes('avanzado') || t.includes('seguridad')) return <ShieldCheck className="w-6 h-6 text-red-500" />;

  return href.split('/').length > 2 ? <FileText className="w-6 h-6 text-blue-400" /> : <Folder className="w-6 h-6 text-amber-400" />;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnim = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function NavigationGrid({ items }: NavigationGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Explorar contenido
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {items.map((item) => (
          <motion.div key={item.href} variants={itemAnim}>
            <Link 
              href={item.href}
              className="group flex flex-col p-5 h-full rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-background border border-border group-hover:scale-110 transition-transform duration-300">
                  {item.icon ? <DynamicIcon icon={item.icon} className="w-6 h-6 text-primary" /> : getIcon(item.title, item.href)}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
