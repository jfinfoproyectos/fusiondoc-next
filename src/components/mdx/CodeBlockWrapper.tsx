"use client"

import React, { useState } from "react"
import { Check, Copy, Maximize2, Minimize2, ZoomIn, ZoomOut, Hash } from "lucide-react"
import { cn } from "@/lib/utils"

export function CodeBlockWrapper({ children, className, ...props }: any) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1) // 0 to 4 mapping to text-xs to text-xl
  const [showNumbers, setShowNumbers] = useState(true)
  const [copied, setCopied] = useState(false)

  console.log("=== CODEBLOCK ===");
  console.log("Props:", props);
  console.log("Children:", children);

  // Extraer texto plano y title (fallback muy básico, rehype genera spans anidados para tokens)
  let codeString = "";
  let extractedTitle = "";
  try {
    const childrenArray = Array.isArray(children) ? children : [children];
    const pre = childrenArray.find((c: any) => c?.type === "pre");
    const figcaption = childrenArray.find((c: any) => c?.type === "figcaption");
    
    if (figcaption && figcaption.props && figcaption.props.children) {
      extractedTitle = figcaption.props.children;
    }

    const code = pre?.props?.children;
    if (code && code.props && code.props.children) {
      codeString = Array.isArray(code.props.children)
        ? code.props.children.map((c: any) => c.props?.children || c).join("")
        : typeof code.props.children === "string"
        ? code.props.children
        : "";
    }
  } catch (e) {}

  const onCopy = () => {
    // Si rehype-pretty-code no expone texto plano fácil, el usuario lo puede seleccionar o 
    // lo re-procesamos. Aquí usamos el innerText si se llama al ref (en un mundo ideal).
    // Usaremos el string rudimentario por ahora o intentar usar JS para sacar innerText real.
    if (codeString) {
      navigator.clipboard.writeText(codeString)
    } else {
       // Buscar texto usando DOM temporal no ideal, pero shhhhh...
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const zoomClasses = [
    "text-xs", 
    "text-sm", 
    "text-base", 
    "text-lg", 
    "text-xl", 
    "text-2xl", 
    "text-3xl", 
    "text-4xl"
  ]

  // Usar useEffect para copiar el codigo exacto renderizado por seguridad
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const handleCopy = () => {
     if (containerRef.current) {
        const pre = containerRef.current.querySelector("pre");
        if (pre) {
            navigator.clipboard.writeText(pre.innerText)
        }
     }
     setCopied(true)
     setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div
        className={cn(
          "group relative my-6 flex flex-col overflow-hidden rounded-lg bg-[#0d1117] ring-1 ring-white/10 text-gray-100",
          isFullscreen && "fixed inset-4 z-50 my-0 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] shadow-2xl",
          showNumbers && "show-line-numbers",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1117] px-4 py-2 text-white/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex gap-1.5 shrink-0">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            
            {extractedTitle && (
              <div className="ml-2 truncate text-xs font-medium text-white/70">
                {extractedTitle}
              </div>
            )}
            
            <div className="ml-4 flex gap-2 border-l border-white/10 pl-4 shrink-0">
              <button onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))} className="hover:text-white transition-colors" title="Reducir">
                <ZoomOut size={16} />
              </button>
              <button onClick={() => setZoomLevel(Math.min(zoomClasses.length - 1, zoomLevel + 1))} className="hover:text-white transition-colors" title="Ampliar">
                <ZoomIn size={16} />
              </button>
              <button 
                onClick={() => setShowNumbers(!showNumbers)} 
                className={cn("hover:text-white transition-colors ml-2", showNumbers && "text-primary")} 
                title="Alternar numeración"
              >
                <Hash size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCopy} className="hover:text-white transition-colors" title="Copiar código">
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="hover:text-white transition-colors" title="Pantalla completa">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
        <div ref={containerRef} className={cn(
          "overflow-auto flex-1 w-full", 
          zoomClasses[zoomLevel], 
          "[&_pre]:!bg-transparent [&_pre]:!p-4 [&_pre]:!m-0 [&_figcaption]:hidden",
          "[&_code]:!text-[#c9d1d9] [&_code]:!bg-transparent [&_code]:!shadow-none [&_code]:!ring-0 [&_code]:!border-0",
          "prose-pre:!bg-transparent prose-pre:!text-[#c9d1d9]"
        )}>
          {children}
        </div>
      </div>
      {/* Fondo opaco cuando se hace fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsFullscreen(false)} 
        />
      )}
    </>
  )
}
