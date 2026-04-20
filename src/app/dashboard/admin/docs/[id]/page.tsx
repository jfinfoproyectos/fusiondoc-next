"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFileTreeAction, getFileContentAction, saveFileContentAction } from "@/app/actions/admin-docs";
import { AdminFileExplorer } from "@/features/admin/AdminFileExplorer";
import { AdminProjectAssistant } from "@/features/admin/AdminProjectAssistant";
import { MdxEditor } from "@/features/admin/MdxEditor";
import { EditorPreview } from "@/features/admin/EditorPreview";
import { Button } from "@/components/ui/button";
import { Loader2, Save, ArrowLeft, Eye, Edit2, Columns, Layout, PanelLeftClose, PanelLeft } from "lucide-react";
import { toast } from "sonner";
import { FileNode } from "@/lib/admin-docs";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export default function DocEditorPage() {
  const { id: projectId } = useParams() as { id: string };
  const router = useRouter();
  
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [currentSha, setCurrentSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Dialog state
  const [isUnsavedDialogOpen, setIsUnsavedDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'select' | 'back', path?: string } | null>(null);

  useEffect(() => {
    loadTree();
  }, [projectId]);

  async function loadTree() {
    try {
      const tree = await getFileTreeAction(projectId);
      setFileTree(tree);
    } catch (error) {
      toast.error("Error al cargar la estructura de archivos");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(path: string) {
    if (content !== originalContent) {
      setPendingAction({ type: 'select', path });
      setIsUnsavedDialogOpen(true);
      return;
    }

    await executeFileSelect(path);
  }

  async function executeFileSelect(path: string) {
    setLoading(true);
    try {
      const data = await getFileContentAction(path);
      setSelectedFile(path);
      setContent(data.content);
      setOriginalContent(data.content);
      setCurrentSha(data.sha);
    } catch (error) {
      toast.error("Error al cargar el archivo");
    } finally {
      setLoading(false);
    }
  }

  const handleDiscard = () => {
    if (!pendingAction) return;
    
    if (pendingAction.type === 'back') {
      router.push("/dashboard/docs");
    } else if (pendingAction.type === 'select' && pendingAction.path) {
      executeFileSelect(pendingAction.path);
    }
    
    setIsUnsavedDialogOpen(false);
    setPendingAction(null);
  };

  const handleSaveAndContinue = async () => {
    if (!selectedFile) return;
    
    setSaving(true);
    try {
      const result = await saveFileContentAction(selectedFile, content, currentSha || undefined);
      if (result.success) {
        setOriginalContent(content);
        setCurrentSha(result.sha || null);
        toast.success("Cambios guardados");
        
        // After save, execute pending action
        if (pendingAction) {
          if (pendingAction.type === 'back') {
            router.push("/dashboard/docs");
          } else if (pendingAction.type === 'select' && pendingAction.path) {
            executeFileSelect(pendingAction.path);
          }
        }
      }
    } catch (error) {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
      setIsUnsavedDialogOpen(false);
      setPendingAction(null);
    }
  };

  async function handleSave() {
    if (!selectedFile) return;
    setSaving(true);
    try {
      const result = await saveFileContentAction(selectedFile, content, currentSha || undefined);
      if (result.success) {
        setOriginalContent(content);
        setCurrentSha(result.sha || null);
        toast.success("Cambios guardados en GitHub");
      }
    } catch (error) {
      toast.error("Error al guardar en GitHub");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !selectedFile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - Inside the content area */}
      <header className="h-14 border-b border-border bg-background/50 backdrop-blur-md flex shrink-0 items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              if (content !== originalContent) {
                setPendingAction({ type: 'back' });
                setIsUnsavedDialogOpen(true);
              } else {
                router.push("/dashboard/docs");
              }
            }} 
            className="rounded-xl shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={cn("rounded-xl shrink-0 transition-colors", !isSidebarOpen && "bg-primary/10 text-primary")}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-sm font-black uppercase tracking-widest text-primary leading-tight truncate">Editor de Docs</h1>
            <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[200px]">
              {selectedFile ? selectedFile.split('/').pop() : projectId}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="hidden md:flex bg-muted/30 p-1 rounded-xl">
            <TabsList className="bg-transparent border-none">
              <TabsTrigger value="edit" className="rounded-lg h-8 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Edit2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="split" className="rounded-lg h-8 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Columns className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase">Dividido</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="rounded-lg h-8 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <Eye className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase">Vista Previa</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <AdminProjectAssistant />

          <Button 
            onClick={handleSave} 
            disabled={!selectedFile || content === originalContent || saving}
            className="rounded-xl h-9 px-4 font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/10"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Guardar
          </Button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar: File Explorer */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.aside 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="border-r border-border bg-muted/5 flex flex-col overflow-hidden shrink-0 h-full min-h-0"
            >
              <div className="w-72 h-full flex flex-col min-h-0">
                <AdminFileExplorer 
                  projectId={projectId}
                  tree={fileTree} 
                  selectedPath={selectedFile} 
                  onSelect={handleFileSelect}
                  onTreeChange={loadTree}
                />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Editor Area */}
        <main className="flex-1 min-w-0 min-h-0 overflow-hidden relative bg-background">
          {selectedFile ? (
            <div className="flex h-full w-full items-stretch overflow-hidden">
              <AnimatePresence mode="wait">
                {(viewMode === "edit" || viewMode === "split") && (
                  <motion.div 
                    key="editor"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ height: '100%', width: '100%' }}
                    className={cn(
                      "h-full min-h-0 min-w-0 flex flex-col flex-1", 
                      viewMode === "split" ? "w-1/2 border-r border-border" : "w-full"
                    )}
                  >
                    <MdxEditor content={content} onChange={setContent} />
                  </motion.div>
                )}
                {(viewMode === "preview" || viewMode === "split") && (
                  <motion.div 
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "h-full min-h-0 min-w-0 flex flex-col", 
                      viewMode === "split" ? "w-1/2" : "w-full"
                    )}
                  >
                    <EditorPreview content={content} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center flex-col gap-4 text-center p-12">
               <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary/20">
                  <Layout className="w-10 h-10" />
               </div>
               <div className="space-y-1">
                 <h3 className="text-xl font-black tracking-tight uppercase">No hay archivo seleccionado</h3>
                 <p className="text-muted-foreground text-sm font-medium">Selecciona un archivo del explorador para comenzar a editar su contenido.</p>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Unsaved Changes AlertDialog */}
      <AlertDialog open={isUnsavedDialogOpen} onOpenChange={setIsUnsavedDialogOpen}>
        <AlertDialogContent className="border-white/10 bg-background/95 backdrop-blur-3xl shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">Cambios sin guardar</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              Hay cambios en el archivo actual que se perderán si continúas sin guardar. ¿Qué deseas hacer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px] border-white/10 hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            
            <Button 
              variant="ghost"
              onClick={handleDiscard}
              className="rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-destructive/10 hover:text-destructive gap-2"
            >
              <Trash2 className="w-3 h-3" />
              Descartar y Continuar
            </Button>

            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleSaveAndContinue();
              }}
              className="rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Guardar y Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
