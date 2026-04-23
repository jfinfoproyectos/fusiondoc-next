"use client";

import React, { useState } from "react";
import { 
  FileCode2, 
  Plus, 
  Trash2, 
  Save, 
  Settings2,
  Info,
  Calendar,
  Eye,
  Activity,
  Globe
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FrontmatterAssistProps {
  currentContent: string;
  onApply: (newContent: string) => void;
}

export function FrontmatterAssist({ currentContent, onApply }: FrontmatterAssistProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse existing frontmatter if any
  const parseFrontmatter = () => {
    const match = currentContent.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    
    const yaml = match[1];
    const data: Record<string, any> = {};
    yaml.split("\n").forEach(line => {
      const [key, ...valParts] = line.split(":");
      if (key && valParts.length) {
        const val = valParts.join(":").trim();
        // Try to handle types
        if (val === "true") data[key.trim()] = true;
        else if (val === "false") data[key.trim()] = false;
        else if (!isNaN(Number(val)) && val !== "") data[key.trim()] = Number(val);
        else data[key.trim()] = val.replace(/^["']|["']$/g, '');
      }
    });
    return data;
  };

  const [data, setData] = useState<Record<string, any>>(parseFrontmatter());

  const handleApply = () => {
    let yaml = "---\n";
    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        yaml += `${key}: ${val}\n`;
      }
    });
    yaml += "---";

    // Replace or prepend
    const hasFrontmatter = /^---\n[\s\S]*?\n---/.test(currentContent);
    const newContent = hasFrontmatter 
      ? currentContent.replace(/^---\n[\s\S]*?\n---/, yaml)
      : `${yaml}\n\n${currentContent}`;
      
    onApply(newContent);
    setIsOpen(false);
    toast.success("Frontmatter actualizado");
  };

  const updateField = (key: string, val: any) => {
    setData(prev => ({ ...prev, [key]: val }));
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
              onClick={() => setData(parseFrontmatter())}
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-widest">
          Configuración Frontmatter
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md border-white/10 bg-[#0d1117]/95 backdrop-blur-3xl shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shadow-2xl shadow-primary/20">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-foreground">Configuración Meta</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Metadata de la página (Frontmatter)</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-6">
          <div className="space-y-6">
            {/* Básicos */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                 <Settings2 className="w-3 h-3" /> Campos Principales
               </h4>
               
               <div className="space-y-2">
                 <Label className="text-xs font-bold">Título (H1)</Label>
                 <Input 
                   value={data.title || ""} 
                   onChange={e => updateField("title", e.target.value)}
                   className="bg-white/5 border-white/10 rounded-xl font-medium"
                   placeholder="Ej: Introducción al Proyecto"
                 />
               </div>

               <div className="space-y-2">
                 <Label className="text-xs font-bold">Descripción</Label>
                 <Input 
                   value={data.description || ""} 
                   onChange={e => updateField("description", e.target.value)}
                   className="bg-white/5 border-white/10 rounded-xl font-medium"
                   placeholder="Breve resumen para el buscador..."
                 />
               </div>
            </div>

            {/* Organización */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                 <Activity className="w-3 h-3" /> Posicionamiento
               </h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Categoría</Label>
                    <Input 
                      value={data.category || ""} 
                      onChange={e => updateField("category", e.target.value)}
                      className="bg-white/5 border-white/10 rounded-xl font-medium"
                      placeholder="Ej: Comenzando"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Orden</Label>
                    <Input 
                      type="number"
                      value={data.order ?? ""} 
                      onChange={e => updateField("order", Number(e.target.value))}
                      className="bg-white/5 border-white/10 rounded-xl font-medium"
                    />
                  </div>
               </div>
            </div>

            {/* Visual & Access */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                 <Eye className="w-3 h-3" /> Visibilidad
               </h4>
               
               <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold">Público</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Visible sin Login</p>
                      </div>
                    </div>
                    <Switch 
                      checked={data.public || false}
                      onCheckedChange={v => updateField("public", v)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 text-white">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold">Borrador (Draft)</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Ocultar de la lista</p>
                      </div>
                    </div>
                    <Switch 
                      checked={data.draft || false}
                      onCheckedChange={v => updateField("draft", v)}
                    />
                  </div>
               </div>

               <div className="space-y-2">
                 <Label className="text-xs font-bold">Lanzamiento Programado</Label>
                 <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                     type="date"
                     value={data.date || ""} 
                     onChange={e => updateField("date", e.target.value)}
                     className="pl-10 bg-white/5 border-white/10 rounded-xl"
                   />
                 </div>
                 <p className="text-[9px] text-muted-foreground italic pl-1">La página se activará automáticamente en esta fecha.</p>
               </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <Button onClick={handleApply} className="w-full rounded-xl h-11 font-black uppercase tracking-widest gap-2 shadow-2xl shadow-primary/20">
            <Save className="w-4 h-4" /> Aplicar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
