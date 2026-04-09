"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { Loader2, Maximize2, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MermaidProps {
  code?: string;
  children?: string;
  title?: string;
  className?: string;
}

export function Mermaid({ code, children, title, className }: MermaidProps) {
  const { theme, resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [zoom, setZoom] = useState(1);
  const id = useId().replace(/:/g, ""); // Remove colons for valid CSS/DOM ID
  const containerRef = useRef<HTMLDivElement>(null);

  const mermaidCode = (code || children || "").trim();

  const renderDiagram = async () => {
    if (!mermaidCode) return;
    
    setIsRendering(true);
    setError(null);

    try {
      const isDark = resolvedTheme === "dark";
      
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
        fontFamily: "var(--font-sans)",
        themeVariables: {
          fontSize: "14px",
          primaryColor: isDark ? "#3b82f6" : "#2563eb",
          // Add more styling variables here to match your premium aesthetic
        }
      });

      const { svg: renderedSvg } = await mermaid.render(`mermaid-${id}`, mermaidCode);
      setSvg(renderedSvg);
    } catch (err: any) {
      console.error("Mermaid Render Error:", err);
      setError("Error al renderizar el diagrama. Verifica la sintaxis.");
    } finally {
      setIsRendering(false);
    }
  };

  useEffect(() => {
    renderDiagram();
  }, [mermaidCode, resolvedTheme]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className={cn(
      "my-10 group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl overflow-hidden min-h-[150px]",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
             <RefreshCw className={cn("w-4 h-4", isRendering && "animate-spin")} />
          </div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {title || "Diagrama Mermaid"}
          </span>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
            title="Alejar"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={handleResetZoom}
            className="text-[10px] font-bold text-muted-foreground hover:text-white px-2 uppercase tracking-tighter"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
            title="Acercar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative p-8 flex flex-col items-center justify-center bg-dot-pattern min-h-[300px] overflow-auto">
        <AnimatePresence mode="wait">
          {isRendering ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 text-muted-foreground"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
              <p className="text-xs font-medium animate-pulse">Generando diagrama...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20"
            >
              <p className="text-sm text-red-400 font-medium mb-2">{error}</p>
              <pre className="text-[10px] text-red-300 opacity-70 p-4 rounded-xl bg-black/20 overflow-auto max-w-full">
                {mermaidCode}
              </pre>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              className="w-full h-full flex items-center justify-center transition-transform duration-300"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer Decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
