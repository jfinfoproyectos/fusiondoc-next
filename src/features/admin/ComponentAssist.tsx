"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Search, 
  ChevronRight, 
  Copy, 
  Check, 
  Info,
  ArrowLeft,
  Settings2,
  Code2,
  Plus
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MDX_REGISTRY, MdxComponentConfig } from "./mdx-registry";
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ComponentAssistProps {
  onInsert: (text: string) => void;
}

export function ComponentAssist({ onInsert }: ComponentAssistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<MdxComponentConfig | null>(null);
  const [propsValues, setPropsValues] = useState<Record<string, any>>({});

  const filteredComponents = MDX_REGISTRY.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(MDX_REGISTRY.map(c => c.category)));

  const handleSelectComponent = (comp: MdxComponentConfig) => {
    setSelectedComponent(comp);
    const initialProps: Record<string, any> = {};
    comp.props.forEach(p => {
      initialProps[p.name] = p.default ?? "";
    });
    setPropsValues(initialProps);
  };

  const handleInsert = () => {
    if (!selectedComponent) return;
    const text = selectedComponent.template(propsValues);
    onInsert(text);
    setIsOpen(false);
    setSelectedComponent(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-primary transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-widest">
          Asistente de Componentes
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[700px] h-[85vh] p-0 overflow-hidden border-white/10 bg-[#0d1117]/95 backdrop-blur-3xl shadow-2xl flex flex-col">
        {/* Semantic Title and Description for Accessibility (Hidden) */}
        <VisuallyHidden.Root>
          <DialogTitle>Asistente de Componentes</DialogTitle>
          <DialogDescription>Selecciona e inserta componentes MDX en tu documento.</DialogDescription>
        </VisuallyHidden.Root>

        {!selectedComponent ? (
          <>
            <div className="p-6 pb-0 shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-2xl shadow-primary/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Asistente de Componentes</h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inyecta componentes interactivos en tu MDX</p>
                </div>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar componentes (ej: Alerta, Bento, Terminal...)" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl font-medium focus:ring-primary/20"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-6 pt-4 min-h-0">
              <div className="space-y-8">
                {categories.map(cat => {
                  const catComps = filteredComponents.filter(c => c.category === cat);
                  if (catComps.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1">{cat}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {catComps.map(comp => (
                          <button
                            key={comp.id}
                            onClick={() => handleSelectComponent(comp)}
                            className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/[0.08] transition-all text-left"
                          >
                            <div className="p-2.5 rounded-xl bg-background border border-white/5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all shadow-lg">
                              <Code2 className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{comp.title}</h4>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{comp.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/30 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedComponent(null)} className="rounded-xl h-9 w-9">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight">{selectedComponent.title}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{selectedComponent.category}</p>
                </div>
              </div>
              <Button onClick={handleInsert} className="rounded-xl h-9 px-6 font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                Insertar
              </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Properties Column */}
              <ScrollArea className="w-1/2 border-r border-white/5 p-6 bg-white/[0.01] h-full">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings2 className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Propiedades</span>
                  </div>
                  
                  {selectedComponent.props.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                      <p className="text-[11px] text-muted-foreground">Este componente no requiere configuración manual.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedComponent.props.map(prop => (
                        <div key={prop.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold">{prop.label}</Label>
                            <span className="text-[9px] font-mono text-muted-foreground/40 bg-white/5 px-1.5 py-0.5 rounded uppercase">{prop.type}</span>
                          </div>
                          
                          {prop.type === "text" && (
                            <Input 
                              value={propsValues[prop.name] || ""} 
                              onChange={(e) => setPropsValues(prev => ({ ...prev, [prop.name]: e.target.value }))}
                              placeholder={prop.placeholder}
                              className="bg-white/5 border-white/10 rounded-xl h-10 text-sm"
                            />
                          )}

                          {prop.type === "number" && (
                            <Input 
                              type="number"
                              value={propsValues[prop.name] ?? ""} 
                              onChange={(e) => setPropsValues(prev => ({ ...prev, [prop.name]: Number(e.target.value) }))}
                              className="bg-white/5 border-white/10 rounded-xl h-10 text-sm"
                            />
                          )}

                          {prop.type === "boolean" && (
                            <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5">
                              <Switch 
                                checked={propsValues[prop.name] || false}
                                onCheckedChange={(val) => setPropsValues(prev => ({ ...prev, [prop.name]: val }))}
                              />
                              <span className="text-xs text-muted-foreground font-medium">{propsValues[prop.name] ? "Activado" : "Desactivado"}</span>
                            </div>
                          )}

                          {prop.type === "select" && (
                            <Select 
                              value={propsValues[prop.name] || ""} 
                              onValueChange={(val) => setPropsValues(prev => ({ ...prev, [prop.name]: val }))}
                            >
                              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-10 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#1a1b1e] border-white/10 rounded-xl">
                                {prop.options?.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {prop.type === "content" && (
                            <Textarea 
                              value={propsValues[prop.name] || ""} 
                              onChange={(e) => setPropsValues(prev => ({ ...prev, [prop.name]: e.target.value }))}
                              className="bg-white/5 border-white/10 rounded-xl min-h-[80px] text-sm resize-none"
                            />
                          )}

                          {prop.type === "json" && (
                            <Textarea 
                              value={typeof propsValues[prop.name] === 'string' ? propsValues[prop.name] : JSON.stringify(propsValues[prop.name], null, 2)} 
                              onChange={(e) => {
                                try {
                                  // We store it as object if it's valid JSON
                                  const parsed = JSON.parse(e.target.value);
                                  setPropsValues(prev => ({ ...prev, [prop.name]: parsed }));
                                } catch {
                                  setPropsValues(prev => ({ ...prev, [prop.name]: e.target.value }));
                                }
                              }}
                              className="bg-white/5 border-white/10 rounded-xl min-h-[120px] font-mono text-[11px] resize-none"
                            />
                          )}

                          {prop.description && (
                            <p className="text-[10px] text-muted-foreground/60 leading-relaxed pl-1">{prop.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Preview Column */}
              <ScrollArea className="w-1/2 h-full">
                <div className="p-6 flex flex-col gap-6 bg-black/20 min-h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">MDX Generado</span>
                  </div>
                  <div className="relative group">
                    <pre className="p-5 rounded-2xl bg-black border border-white/10 text-[11px] font-mono text-primary/70 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-2xl">
                      {selectedComponent.template(propsValues)}
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedComponent.template(propsValues));
                        toast.success("Código copiado");
                      }}
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {selectedComponent.helpMarkdown && (
                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
                    <Info className="w-5 h-5 text-primary shrink-0" />
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">Tips de Uso</h5>
                      <p className="text-[11px] text-muted-foreground/80 leading-relaxed">{selectedComponent.helpMarkdown}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
      </DialogContent>
    </Dialog>
  );
}
