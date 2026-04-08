'use client';

import React, { useEffect, useRef, useState } from 'react';
// Mermaid will be loaded lazily on the client to avoid SSR overhead
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, Maximize2 } from 'lucide-react';

interface MermaidProps {
  chart: string;
  id?: string;
  title?: string;
}

// Singleton to ensure mermaid is initialized only once
let mermaidPromise: Promise<any> | null = null;

const getMermaid = async () => {
  if (typeof window === 'undefined') return null;
  if (!mermaidPromise) {
    mermaidPromise = (async () => {
      const m = await import('mermaid');
      const mermaid = m.default ?? m;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif',
        themeVariables: {
          primaryColor: '#6366f1',
          primaryTextColor: '#fff',
          primaryBorderColor: '#6366f1',
          lineColor: '#4f46e5',
          secondaryColor: '#1e293b',
          tertiaryColor: '#0f172a',
        },
      });
      return mermaid;
    })();
  }
  return mermaidPromise;
};

export function Mermaid({ chart, id = 'mermaid-chart', title }: MermaidProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        if (!chart || chart.trim() === '') {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);

        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default ?? mermaidModule;

        if (!isMounted) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Inter, sans-serif',
        });

        const safeId = `m${Math.random().toString(36).substring(2, 11)}`;
        const cleanChart = chart.replace(/\\n/g, '\n').trim();
        
        console.log('[Mermaid] Rendering ID:', safeId);

        // mermaid.render returns a promise that resolves to { svg }
        const { svg: renderedSvg } = await mermaid.render(safeId, cleanChart);
        
        if (isMounted) {
          if (renderedSvg) {
            setSvg(renderedSvg);
          } else {
            throw new Error('Diagrama vacío');
          }
        }
      } catch (err: any) {
        console.error('[Mermaid] Render error:', err);
        if (isMounted) {
          setError(err?.message || 'Error de sintaxis');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);


  return (
    <div className="relative my-8 group">
      {title && (
        <div className="mb-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
          {title}
        </div>
      )}
      
      <div 
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-sm p-8 min-h-[150px] flex items-center justify-center transition-all group-hover:border-primary/30"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-muted-foreground/40"
            >
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-[10px] uppercase tracking-tighter font-bold">Generando Diagrama...</span>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 text-red-400 bg-red-400/5 p-6 rounded-2xl border border-red-400/10 text-center"
            >
              <AlertCircle className="w-6 h-6" />
              <p className="text-xs font-medium">{error}</p>
              <pre className="text-[9px] opacity-40 font-mono mt-2 bg-black/40 p-2 rounded max-w-md overflow-auto">{chart.substring(0, 50)}...</pre>
            </motion.div>
          ) : (
            <div 
              key="content"
              className="w-full h-full flex justify-center mermaid-svg-container"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action Overlay */}
      {!isLoading && !error && svg && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <style jsx global>{`
        .mermaid-svg-container svg {
          height: auto !important;
          width: 100% !important;
          max-width: 1000px !important;
          filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.15));
        }
        .mermaid-svg-container .edgePath .path {
          stroke: #6366f1 !important;
          stroke-width: 2px !important;
        }
        .mermaid-svg-container .node rect {
          fill: #1e1b4b !important;
          stroke: #6366f1 !important;
          stroke-width: 1.5px !important;
          rx: 8px !important;
        }
        .mermaid-svg-container .label {
          color: #fff !important;
          font-family: inherit !important;
          font-weight: 500 !important;
        }
      `}</style>
    </div>
  );
}

export default Mermaid;
