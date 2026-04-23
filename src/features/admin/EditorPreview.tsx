"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, RefreshCw } from "lucide-react";
import { renderMdxPreviewAction } from "@/app/actions/admin-docs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MdxErrorFallback } from "@/components/MdxErrorFallback";

interface EditorPreviewProps {
  content: string;
}

export function EditorPreview({ content }: EditorPreviewProps) {
  const debouncedContent = useDebounce(content, 500);
  const [preview, setPreview] = useState<React.ReactNode>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleThemeChange = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener("code-theme-change", handleThemeChange);
    return () => window.removeEventListener("code-theme-change", handleThemeChange);
  }, []);

  useEffect(() => {
    if (!debouncedContent) {
      setPreview(null);
      setError(false);
      return;
    }

    startTransition(async () => {
      try {
        setError(false);
        const jsx = await renderMdxPreviewAction(debouncedContent);
        setPreview(jsx);
      } catch (err) {
        console.error("Error rendering preview:", err);
        setError(true);
      }
    });
  }, [debouncedContent, refreshTrigger]);

  return (
    <div className="h-full w-full overflow-y-auto p-6 pb-24 custom-scrollbar bg-background/50 relative">
      <div className="max-w-5xl mx-auto">
        {isPending && (
          <div className="absolute top-4 right-4 z-50">
            <div className="bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sincronizando...</span>
            </div>
          </div>
        )}

        <ErrorBoundary key={debouncedContent}>
          {error ? (
            <MdxErrorFallback />
          ) : preview ? (
            <div className="animate-in fade-in duration-500">
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                </div>
              }>
                {preview}
              </Suspense>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-40">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
               <p className="text-xs font-bold uppercase tracking-widest leading-tight">Cargando vista previa...</p>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
