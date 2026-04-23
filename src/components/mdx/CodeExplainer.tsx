'use client';

import React, { useState, Children, isValidElement, useMemo, useRef, useEffect, useId } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, FileCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileData {
  title: string;
  codeBlock: React.ReactNode;
  steps: React.ReactElement[];
}

export function CodeExplainer({ children, className }: { children: React.ReactNode, className?: string }) {
  const instanceId = useId().replace(/:/g, '-');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  // Track step index for each file independently
  const [stepIndexes, setStepIndexes] = useState<number[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group children into files
  const files: FileData[] = useMemo(() => {
    const extractedFiles: FileData[] = [];
    let currentLegacySteps: React.ReactElement[] = [];
    let currentLegacyCode: React.ReactNode = null;

    Children.forEach(children, (child) => {
      if (!isValidElement(child)) return;
      
      const childProps = child.props as any;
      const childType = child.type as any;
      const typeName = childType?.displayName || childType?.name || childProps?.mdxType;

      if (typeName === 'CodeExplainerFile' || childProps?.title && childProps?.children) {
        // Multi-file structure
        const fileChildren = childProps.children;
        let fileCode: React.ReactNode = null;
        const fileSteps: React.ReactElement[] = [];

        Children.forEach(fileChildren, (fChild) => {
          if (!isValidElement(fChild)) return;
          const fProps = fChild.props as any;
          const fType = fChild.type as any;
          const fTypeName = fType?.displayName || fType?.name || fProps?.mdxType;

          if (fTypeName === 'CodeExplainerStep' || fProps?.lines) {
            fileSteps.push(fChild);
          } else if (!fileCode) {
            fileCode = fChild;
          }
        });

        extractedFiles.push({
          title: childProps.title || `Archivo ${extractedFiles.length + 1}`,
          codeBlock: fileCode,
          steps: fileSteps
        });
      } else {
        // Collect into a single legacy file if no explainer files are found yet
        if (typeName === 'CodeExplainerStep' || childProps?.lines) {
          currentLegacySteps.push(child);
        } else if (!currentLegacyCode) {
          currentLegacyCode = child;
        }
      }
    });

    // If no explicit files were found, the flat children form the single "default" file
    if (extractedFiles.length === 0 && (currentLegacyCode || currentLegacySteps.length > 0)) {
      extractedFiles.push({
        title: 'Código',
        codeBlock: currentLegacyCode,
        steps: currentLegacySteps
      });
    }

    return extractedFiles;
  }, [children]);

  // Sync stepIndexes length with files length
  useEffect(() => {
    if (stepIndexes.length !== files.length) {
      setStepIndexes(new Array(files.length).fill(0));
    }
  }, [files, stepIndexes.length]);

  const currentFileData = files[activeFileIndex] || { title: '', codeBlock: null, steps: [] };
  const currentStep = stepIndexes[activeFileIndex] || 0;
  const steps = currentFileData.steps;
  const activeLines = (steps[currentStep]?.props as any)?.lines || "";

  // Parse lines into a usable array [1, 2, 3, 5]
  const parseLines = (linesStr: string) => {
    if (!linesStr) return [];
    const lines: number[] = [];
    const parts = (linesStr+"").split(',');
    parts.forEach(p => {
      const range = p.trim().split('-');
      if (range.length === 2) {
        for (let i = parseInt(range[0]); i <= parseInt(range[1]); i++) {
          if (!isNaN(i)) lines.push(i);
        }
      } else {
        const i = parseInt(p.trim());
        if (!isNaN(i)) lines.push(i);
      }
    });
    return lines;
  };

  const activeLineNumbers = useMemo(() => parseLines(activeLines), [activeLines]);

  // Auto-scroll to the first highlighted line
  useEffect(() => {
    if (scrollRef.current && activeLineNumbers.length > 0) {
      const firstLine = activeLineNumbers[0];
      const lineElement = scrollRef.current.querySelector(`[data-line]:nth-child(${firstLine})`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLineNumbers, activeFileIndex]);

  const updateStepAtActiveFile = (newStep: number) => {
    setStepIndexes(prev => {
      const next = [...prev];
      next[activeFileIndex] = newStep;
      return next;
    });
  };

  const handleNext = () => updateStepAtActiveFile(Math.min(steps.length - 1, currentStep + 1));
  const handlePrev = () => updateStepAtActiveFile(Math.max(0, currentStep - 1));

  return (
    <>
      <div className={cn(
        "code-explainer-root w-full my-6 rounded-lg overflow-hidden ring-1 ring-white/10 bg-[#0d1117] flex flex-col shadow-lg",
        `ce-inst-${instanceId}`,
        isFullscreen && "!fixed !inset-4 !z-50 !my-0 !h-[calc(100vh-2rem)] !w-[calc(100vw-2rem)]",
        className
      )}>
        {/* Tab Bar (only show if multiple files) */}
        {files.length > 1 && (
          <div className="flex bg-white/[0.03] border-b border-white/10 overflow-x-auto no-scrollbar">
            {files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFileIndex(idx)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-wide transition-all border-r border-white/10 outline-none",
                  activeFileIndex === idx 
                    ? "bg-primary/5 text-primary border-b-2 border-b-primary shadow-[inset_0_-8px_16px_-12px_rgba(6,182,212,0.4)]" 
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
                )}
              >
                <FileCode size={14} className={activeFileIndex === idx ? "text-primary" : "text-white/20"} />
                {file.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Panel: The Code */}
          <div className={cn(
            "relative flex flex-col md:border-r border-white/10 w-full md:w-3/5 overflow-hidden",
            "[&_>_.code-explainer-area_>_div]:!my-0 [&_>_.code-explainer-area_>_div]:!h-full [&_>_.code-explainer-area_>_div]:!rounded-none [&_>_.code-explainer-area_>_div]:!border-0 [&_>_.code-explainer-area_>_div]:!ring-0",
            "[&_button[title='Pantalla completa']]:!hidden",
            "code-explainer-left"
          )}>
            <style suppressHydrationWarning>{`
              .ce-inst-${instanceId} .code-explainer-area [data-line] {
                  transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out;
                  opacity: 0.3;
                  scroll-margin-top: 3rem;
              }
              ${activeLineNumbers.map(line => `
                .ce-inst-${instanceId} .code-explainer-area [data-line]:nth-child(${line}) {
                  opacity: 1 !important;
                  background-color: color-mix(in srgb, var(--primary) 15%, transparent) !important;
                  box-shadow: inset 4px 0 0 0 var(--primary);
                }
              `).join('\n')}
              ${activeLineNumbers.length === 0 ? `
                .ce-inst-${instanceId} .code-explainer-area [data-line] { opacity: 1; }
              ` : ''}
            `}</style>

            <div ref={scrollRef} className="code-explainer-area flex-1 w-full h-full min-h-0 overflow-hidden">
              {currentFileData.codeBlock}
            </div>
          </div>

          {/* Right Panel: The Interactive Explanation */}
          <div className="relative flex flex-col w-full md:w-2/5 bg-white/5 p-6 border-t md:border-t-0 border-white/10 min-h-[300px] overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest shrink-0">
                {currentFileData.title} • Paso {currentStep + 1} de {steps.length > 0 ? steps.length : 1}
              </div>
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)} 
                className="text-white/40 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 shrink-0 outline-none" 
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar prose prose-invert prose-sm max-w-none pr-4 pb-4">
              {steps.length > 0 ? (
                <div key={`${activeFileIndex}-${currentStep}`} className="animate-in fade-in slide-in-from-right-2 duration-500">
                  {steps[currentStep]}
                </div>
              ) : (
                <div className="text-white/50 italic flex items-center justify-center h-full text-center p-8">
                  No hay guías para este archivo.
                </div>
              )}
            </div>

            {/* Controls */}
            {steps.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 shrink-0">
                <button 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  className="flex items-center justify-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-md hover:bg-white/10 text-white/70 disabled:opacity-30 outline-none"
                >
                  <ChevronLeft size={14} /> Ant.
                </button>
                
                <div className="flex gap-1.5 items-center justify-center flex-wrap px-2">
                  {steps.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => updateStepAtActiveFile(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300 outline-none",
                        idx === currentStep ? "bg-primary w-4 shadow-[0_0_8px_rgba(6,182,212,0.6)]" : "bg-white/20 w-1.5 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={handleNext} 
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center justify-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-md hover:bg-white/10 text-white/70 disabled:opacity-30 outline-none"
                >
                  Sig. <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setIsFullscreen(false)} />
      )}
    </>
  );
}

// Wrapper component for steps
export function CodeExplainerStep({ children, lines }: { children: React.ReactNode, lines: string }) {
  return <>{children}</>;
}

// Wrapper component for files (used to group code + steps)
export function CodeExplainerFile({ children, title }: { children: React.ReactNode, title: string }) {
  return <>{children}</>;
}
