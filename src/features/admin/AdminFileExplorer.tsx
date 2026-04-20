"use client";

import React, { useState } from "react";
import { 
  Folder as FolderIcon, 
  FolderOpen, 
  File as FileIcon, 
  ChevronRight, 
  FileText, 
  Plus, 
  Trash2, 
  MoreVertical,
  Edit2,
  FilePlus,
  FolderPlus,
  Search,
  Hash,
  AlertCircle,
  FileCode2,
  Library,
  Copy,
  FolderTree,
  Terminal as TerminalIcon,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FileNode } from "@/lib/admin-docs";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { createItemAction, deleteItemAction, renameItemAction, moveItemAction } from "@/app/actions/admin-docs";
import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminFileExplorerProps {
  projectId: string;
  tree: FileNode[];
  selectedPath: string | null;
  onSelect: (path: string) => void;
  onTreeChange: () => void;
}

type DialogType = 'file' | 'folder' | 'rename' | 'delete' | null;

export function AdminFileExplorer({ 
  projectId, 
  tree, 
  selectedPath, 
  onSelect, 
  onTreeChange 
}: AdminFileExplorerProps) {
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState<{
    type: DialogType;
    parentPath: string;
    nodeType?: 'file' | 'folder';
    itemName?: string;
    itemSha?: string;
  }>({ type: null, parentPath: projectId });
  
  const [inputValue, setInputValue] = useState("");
  const [inputPrefix, setInputPrefix] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTree = tree.filter(node => 
    node.name.toLowerCase().includes(search.toLowerCase()) ||
    (node.children && node.children.some(c => c.name.toLowerCase().includes(search.toLowerCase())))
  );

  const handleOpenDialog = (type: DialogType, parentPath: string, nodeType?: 'file' | 'folder', currentName?: string, sha?: string) => {
    setDialogState({ type, parentPath, nodeType, itemName: currentName, itemSha: sha });
    
    if (type === 'file' || type === 'folder') {
      // Intentar predecir el siguiente prefijo numérico
      const siblings = parentPath === projectId ? tree : findNodeByPath(tree, parentPath)?.children || [];
      const prefixes = siblings
        .map(s => parseInt(s.name.split('-')[0]))
        .filter(n => !isNaN(n));
      const nextNum = prefixes.length > 0 ? Math.max(...prefixes) + 1 : 1;
      setInputPrefix(nextNum.toString().padStart(2, '0'));
      setInputValue("");
    } else {
      setInputValue(currentName || "");
      setInputPrefix("");
    }
  };

  const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = findNodeByPath(node.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const handleConfirm = async () => {
    if (!dialogState.type) return;
    setIsSubmitting(true);
    
    try {
      if (dialogState.type === 'file' || dialogState.type === 'folder') {
        if (!inputValue) throw new Error("El nombre es requerido");
        const slug = inputValue.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
        const finalName = inputPrefix ? `${inputPrefix}-${slug}` : slug;
        
        await createItemAction(dialogState.parentPath, finalName, dialogState.type as 'file' | 'folder');
        toast.success(`¡${dialogState.type === 'file' ? 'Archivo' : 'Carpeta'} creado con éxito!`);
      } else if (dialogState.type === 'rename') {
        if (!inputValue || !dialogState.itemSha) throw new Error("Datos incompletos para renombrar");
        await renameItemAction(dialogState.parentPath, inputValue, dialogState.itemSha);
        toast.success("Elemento renombrado.");
      } else if (dialogState.type === 'delete') {
        if (!dialogState.itemSha) throw new Error("Falta el ID del archivo (SHA)");
        await deleteItemAction(dialogState.parentPath, dialogState.itemSha);
        toast.success("Elemento eliminado.");
      }
      
      onTreeChange();
      setDialogState({ type: null, parentPath: projectId });
      setInputValue("");
    } catch (error: any) {
      toast.error(error.message || "Error al procesar la acción");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMove = async (oldPath: string, newParentPath: string, sha: string) => {
    try {
      // Evitar mover a la misma ubicación
      const oldParent = oldPath.split('/').slice(0, -1).join('/');
      if (oldParent === newParentPath) return;

      setIsSubmitting(true);
      await moveItemAction(oldPath, newParentPath, sha);
      toast.success("Elemento movido con éxito");
      onTreeChange();
    } catch (error: any) {
      toast.error(error.message || "Error al mover el elemento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-full"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const path = e.dataTransfer.getData("path");
        const sha = e.dataTransfer.getData("sha");
        if (path && sha) {
          handleMove(path, projectId, sha);
        }
      }}
    >
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar archivos..."
            className="w-full h-9 pl-9 pr-4 bg-background border border-border/50 rounded-xl text-xs font-medium focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Estructura</span>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => handleOpenDialog('folder', projectId, 'folder')}>
               <FolderPlus className="w-3.5 h-3.5" />
             </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => handleOpenDialog('file', projectId, 'file')}>
               <FilePlus className="w-3.5 h-3.5" />
             </Button>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-32 space-y-0.5 custom-scrollbar">
        {filteredTree.map((node) => (
          <FileTreeNode 
            key={node.path} 
            node={node} 
            projectId={projectId}
            level={0} 
            selectedPath={selectedPath} 
            onSelect={onSelect}
            onTreeChange={onTreeChange}
            onOpenDialog={handleOpenDialog}
            onMove={handleMove}
          />
        ))}
      </nav>

      {/* Global Action Dialog */}
      <Dialog open={!!dialogState.type} onOpenChange={(open) => !open && setDialogState({ type: null, parentPath: projectId })}>
        <DialogContent className="sm:max-w-[425px] border-white/10 bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">
              {dialogState.type === 'file' && "Nuevo Archivo"}
              {dialogState.type === 'folder' && "Nueva Carpeta"}
              {dialogState.type === 'rename' && "Renombrar Elemento"}
              {dialogState.type === 'delete' && "¿Eliminar Elemento?"}
            </DialogTitle>
            <DialogDescription>
              {dialogState.type === 'delete' 
                ? `¿Estás seguro de eliminar "${dialogState.itemName}"? Esta acción es irreversible.` 
                : "Ingresa el nombre para continuar."}
            </DialogDescription>
          </DialogHeader>

          {dialogState.type !== 'delete' && (
            <div className="py-4 space-y-4">
              {(dialogState.type === 'file' || dialogState.type === 'folder') ? (
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70 flex items-center gap-1.5">
                      <Hash className="w-3 h-3" /> Orden
                    </Label>
                    <Input 
                      value={inputPrefix}
                      maxLength={2}
                      onChange={(e) => setInputPrefix(e.target.value.replace(/\D/g, ''))}
                      className="h-11 bg-white/5 border-white/10 text-center font-mono"
                      placeholder="01"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/70">Nombre / Título</Label>
                    <Input 
                      value={inputValue} 
                      autoFocus
                      onChange={(e) => setInputValue(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                      className="h-11 bg-white/5 border-white/10"
                      placeholder={dialogState.type === 'file' ? "Introducción al Proyecto" : "Conceptos Básicos"}
                    />
                  </div>
                  
                  {inputValue && (
                    <div className="col-span-4 p-3 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-primary">Vista Previa del Archivo</span>
                      </div>
                      <code className="text-[11px] font-mono text-muted-foreground break-all">
                        {inputPrefix ? `${inputPrefix}-` : ""}{inputValue.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-')}{dialogState.type === 'file' ? ".md" : "/"}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase text-primary/70">Nuevo Nombre</Label>
                  <Input 
                    id="name" 
                    value={inputValue} 
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    onChange={(e) => setInputValue(e.target.value)} 
                    className="h-11 bg-white/5 border-white/10"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4 gap-2">
            <Button variant="ghost" onClick={() => setDialogState({ type: null, parentPath: projectId })} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={isSubmitting}
              variant={dialogState.type === 'delete' ? 'destructive' : 'default'}
              className="gap-2 px-6 font-black uppercase tracking-widest shadow-lg"
            >
              {isSubmitting && <Plus className="w-4 h-4 animate-spin" />}
              {dialogState.type === 'delete' ? 'Eliminar' : (dialogState.type === 'rename' ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FileTreeNode({ 
  node, 
  projectId,
  level, 
  selectedPath, 
  onSelect, 
  onTreeChange,
  onOpenDialog,
  onMove
}: { 
  node: FileNode; 
  projectId: string;
  level: number; 
  selectedPath: string | null; 
  onSelect: (path: string) => void;
  onTreeChange: () => void;
  onOpenDialog: (type: DialogType, parentPath: string, nodeType?: 'file' | 'folder', currentName?: string, sha?: string) => void;
  onMove: (oldPath: string, newParentPath: string, sha: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const [isDragOver, setIsDragOver] = useState(false);
  const isSelected = selectedPath === node.path;
  const isFolder = node.type === "folder";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onSelect(node.path);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("path", node.path);
    e.dataTransfer.setData("sha", node.sha || "");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isFolder && node.path !== selectedPath) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedPath = e.dataTransfer.getData("path");
    const draggedSha = e.dataTransfer.getData("sha");
    
    // Solo permitir soltar sobre carpetas y que no sea sobre sí mismo o un padre inmediato
    if (isFolder && draggedPath && draggedPath !== node.path) {
      onMove(draggedPath, node.path, draggedSha);
    }
  };

  return (
    <div className="select-none">
      <div 
        onClick={handleToggle}
        draggable={!isFolder}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-all group",
          isSelected ? "bg-primary/10 text-primary" : "hover:bg-white/5",
          isDragOver && "bg-primary/20 ring-1 ring-primary/40 shadow-lg shadow-primary/5 scale-[1.02]"
        )}
        style={{ paddingLeft: `${(level * 12) + 12}px` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isFolder ? (
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} className="shrink-0">
              <ChevronRight className={cn("w-3.5 h-3.5", isSelected ? "text-primary" : "text-muted-foreground/40")} />
            </motion.div>
          ) : (
            <FileText className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground/40")} />
          )}
          
          {isFolder ? (
             isOpen ? <FolderOpen className="w-4 h-4 text-primary shrink-0" /> : <FolderIcon className="w-4 h-4 text-primary/60 shrink-0" />
          ) : null}

          <span className={cn(
            "text-xs font-medium truncate",
            isSelected ? "font-bold" : "text-foreground/80 group-hover:text-foreground"
          )}>
            {node.name}
          </span>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="p-1 hover:bg-black/10 rounded-md transition-colors animate-in fade-in duration-300">
                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-border/50 rounded-xl">
              {isFolder && (
                <>
                  <DropdownMenuItem onClick={() => onOpenDialog('file', node.path, 'file')} className="text-xs gap-2 font-medium">
                    <FilePlus className="w-3.5 h-3.5" />
                    Nuevo Archivo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOpenDialog('folder', node.path, 'folder')} className="text-xs gap-2 font-medium">
                    <FolderPlus className="w-3.5 h-3.5" />
                    Nueva Carpeta
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onOpenDialog('rename', node.path, node.type as any, node.name, node.sha)} className="text-xs gap-2 font-medium">
                <Edit2 className="w-3.5 h-3.5" />
                Renombrar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onOpenDialog('delete', node.path, node.type as any, node.name, node.sha)} className="text-xs gap-2 font-medium text-destructive focus:text-destructive">
                <Trash2 className="w-3.5 h-3.5" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTreeNode 
                key={child.path} 
                node={child} 
                level={level + 1} 
                projectId={projectId}
                selectedPath={selectedPath} 
                onSelect={onSelect}
                onTreeChange={onTreeChange}
                onOpenDialog={onOpenDialog}
                onMove={onMove}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Removing manual FilePlus definition as it's already imported from lucide-react
