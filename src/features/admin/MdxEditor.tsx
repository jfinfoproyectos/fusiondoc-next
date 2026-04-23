import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { 
  Sparkles, 
  Settings, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Minus,
  CheckSquare,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ComponentAssist } from "./ComponentAssist";
import { FrontmatterAssist } from "./FrontmatterAssist";
import { toast } from "sonner";

interface MdxEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export function MdxEditor({ content, onChange }: MdxEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Use ResizeObserver to keep Monaco in sync with its container
    if (editorContainerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        editor.layout();
      });
      resizeObserver.observe(editorContainerRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  };

  const handleFormat = (prefix: string, suffix: string = "", placeholder: string = "") => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    const selectedText = model.getValueInRange(selection) || "";
    
    let newText = "";
    if (selectedText) {
      newText = `${prefix}${selectedText}${suffix}`;
    } else {
      newText = `${prefix}${placeholder}${suffix}`;
    }

    const range = new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    );

    const textEdit = {
      range: range,
      text: newText,
      forceMoveMarkers: true,
    };

    editor.executeEdits("format", [textEdit]);
    
    // Better cursor positioning for placeholders
    if (!selectedText && placeholder) {
      const startLine = selection.startLineNumber;
      const startCol = selection.startColumn + prefix.length;
      editor.setSelection(new monaco.Selection(
        startLine,
        startCol,
        startLine,
        startCol + placeholder.length
      ));
    }
    
    editor.focus();
  };

  const handleLineFormat = (prefix: string) => {
    if (!editorRef.current || !monacoRef.current) return;
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const selection = editor.getSelection();
    if (!selection) return;

    const model = editor.getModel();
    if (!model) return;

    const edits: any[] = [];
    for (let i = selection.startLineNumber; i <= selection.endLineNumber; i++) {
        edits.push({
            range: new monaco.Range(i, 1, i, 1),
            text: prefix,
            forceMoveMarkers: true
        });
    }

    editor.executeEdits("line-format", edits);
    editor.focus();
  };

  const handleInsert = (text: string) => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const selection = editor.getSelection();
    if (!selection) return;
    
    const textEdit = {
      range: new monaco.Range(
        selection.startLineNumber,
        selection.startColumn,
        selection.endLineNumber,
        selection.endColumn
      ),
      text: text,
      forceMoveMarkers: true,
    };

    editor.executeEdits("assistant-insert", [textEdit]);
    editor.focus();
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden bg-background">
      {/* Dynamic Toolbar */}
      <div className="flex shrink-0 items-center overflow-x-auto gap-0.5 p-1.5 border-b border-white/5 bg-background/50 backdrop-blur-md no-scrollbar">
        <TooltipProvider delayDuration={400}>

          {/* Group: Text Style */}
          <div className="flex items-center gap-0.5 pr-1 mr-1 border-r border-white/10">
            <FormatButton icon={<Bold className="w-4 h-4" />} label="Negrita" onClick={() => handleFormat("**", "**", "texto")} />
            <FormatButton icon={<Italic className="w-4 h-4" />} label="Itálica" onClick={() => handleFormat("*", "*", "texto")} />
            <FormatButton icon={<Strikethrough className="w-4 h-4" />} label="Tachado" onClick={() => handleFormat("~~", "~~", "texto")} />
            <FormatButton icon={<Code2 className="w-4 h-4" />} label="Código Inline" onClick={() => handleFormat("`", "`", "codigo")} />
            <FormatButton 
              icon={<Terminal className="w-4 h-4" />} 
              label="Bloque de Código" 
              onClick={() => handleFormat("```\n", "\n```", "codigo")} 
            />
          </div>

          {/* Group: Structure */}
          <div className="flex items-center gap-0.5 pr-1 mr-1 border-r border-white/10">
            <FormatButton icon={<Heading1 className="w-4 h-4" />} label="Título 1" onClick={() => handleLineFormat("# ")} />
            <FormatButton icon={<Heading2 className="w-4 h-4" />} label="Título 2" onClick={() => handleLineFormat("## ")} />
            <FormatButton icon={<Heading3 className="w-4 h-4" />} label="Título 3" onClick={() => handleLineFormat("### ")} />
            <FormatButton icon={<Quote className="w-4 h-4" />} label="Cita" onClick={() => handleLineFormat("> ")} />
          </div>

          {/* Group: Lists */}
          <div className="flex items-center gap-0.5 pr-1 mr-1 border-r border-white/10">
            <FormatButton icon={<List className="w-4 h-4" />} label="Lista de Puntos" onClick={() => handleLineFormat("- ")} />
            <FormatButton icon={<ListOrdered className="w-4 h-4" />} label="Lista Numerada" onClick={() => handleLineFormat("1. ")} />
            <FormatButton icon={<CheckSquare className="w-4 h-4" />} label="Lista de Tareas" onClick={() => handleLineFormat("- [ ] ")} />
          </div>

          {/* Group: Media & Misc */}
          <div className="flex items-center gap-0.5 pr-1 mr-1 border-r border-white/10">
            <FormatButton icon={<LinkIcon className="w-4 h-4" />} label="Enlace" onClick={() => handleFormat("[", "](url)", "titulo")} />
            <FormatButton icon={<ImageIcon className="w-4 h-4" />} label="Imagen" onClick={() => handleFormat("![", "](url)", "alt")} />
            <FormatButton icon={<Minus className="w-4 h-4" />} label="Línea Divisoria" onClick={() => handleInsert("\n---\n")} />
          </div>

          {/* Group: Assistants */}
          <div className="flex items-center gap-0.5">
            <FrontmatterAssist currentContent={content} onApply={onChange} />
            <ComponentAssist onInsert={handleInsert} />
          </div>
        </TooltipProvider>
      </div>

      {/* Editor Container - Strict Flex Hierarchy */}
      <div 
        ref={editorContainerRef}
        className="flex-1 w-full min-h-0 relative overflow-hidden bg-background"
      >
        <div className="absolute inset-0">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="markdown"
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            value={content}
            onChange={(value) => onChange(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              lineNumbers: "on",
              folding: true,
              glyphMargin: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20, bottom: 100 },
              fontFamily: "'JetBrains Mono', monospace",
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              }
            }}
          />
        </div>
      </div>

    </div>
  );
}

function FormatButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClick}
          className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-primary transition-all shrink-0"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-[10px] font-bold uppercase tracking-widest font-sans">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
