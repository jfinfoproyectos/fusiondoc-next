'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search as SearchIcon, X, FileText, Command, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { getEffectiveProject } from '@/lib/version-utils';

export default function Search({ 
  projects, 
  subdomainMode 
}: { 
  projects: { id: string, name: string }[], 
  subdomainMode: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeVersion = getEffectiveProject(pathname, projects);
  const inputRef = useRef<HTMLInputElement>(null);


  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev);
    setQuery('');
    setResults([]);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSearch]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = `/api/search?q=${encodeURIComponent(query)}${activeVersion ? `&version=${activeVersion}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (url: string) => {
    // Si estamos en modo subdominio y el resultado pertenece a este proyecto, removemos el prefijo.
    let targetUrl = url;
    if (subdomainMode && activeVersion && url.startsWith(`/${activeVersion}`)) {
      targetUrl = url.replace(`/${activeVersion}`, '') || '/';
    }
    router.push(targetUrl);
    setIsOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex].url);
    }
  };

  return (
    <>
      <button
        onClick={mounted ? toggleSearch : undefined}
        disabled={!mounted}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-all group w-full max-w-[240px] border border-border
          ${mounted 
            ? 'text-muted-foreground hover:border-primary/50 hover:bg-accent/50 cursor-pointer' 
            : 'text-muted-foreground/50 cursor-default opacity-50'}
        `}
      >
        <SearchIcon className="w-4 h-4" />
        <span className="flex-1 text-left">Buscar</span>
        {mounted && (
          <kbd className="hidden md:flex flex-row items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-border">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="flex items-center px-4 border-b border-border h-14">
                <SearchIcon className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  ref={inputRef}
                  autoFocus
                  placeholder="Escribe para buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground h-full py-2"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-accent rounded-md transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p>Indexando contenido...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result, i) => (
                      <button
                        key={i}
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => handleSelect(result.url)}
                        className={`w-full flex items-start text-left p-3 rounded-lg transition-all gap-3 ${
                          i === selectedIndex ? 'bg-primary/10 border-primary/20' : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className={`mt-0.5 p-2 rounded-md ${i === selectedIndex ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground truncate">{result.title}</span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-muted border border-border rounded text-muted-foreground font-mono">
                              {result.topic}
                            </span>
                            {result.version && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary font-mono">
                                {result.version}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {result.content}
                          </p>
                        </div>
                        {i === selectedIndex && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-primary/70 font-mono animate-pulse">
                            <span>Enter</span>
                            <CornerDownLeft className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : query && !isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground italic">
                    No se encontraron resultados para "{query}"
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm gap-2">
                    <Command className="w-8 h-8 opacity-20 mb-2" />
                    <p>Escribe una palabra clave para buscar en la documentación</p>
                    <div className="flex gap-2 mt-2 opacity-60">
                      <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↑↓</kbd>
                      <span>para navegar</span>
                      <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border ml-2">↵</kbd>
                      <span>para seleccionar</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-muted/30 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground px-4">
                <div className="flex gap-4">
                   <span className="flex items-center gap-1"><kbd className="bg-muted px-1 rounded border border-border">ESC</kbd> Cerrar</span>
                </div>
                <div className="flex items-center gap-1">
                  Powered by <span className="text-primary font-bold">ORAMA</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
