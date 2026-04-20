"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { toggleDocPublicStatus } from "@/app/actions/docs";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DocStatusToggleProps {
  id: string;
  initialIsPublic: boolean;
}

export function DocStatusToggle({ id, initialIsPublic }: DocStatusToggleProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (checked: boolean) => {
    // Actualización optimista local
    setIsPublic(checked);

    startTransition(async () => {
      const result = await toggleDocPublicStatus(id, checked);
      
      if (!result.success) {
        // Revertir si falla
        setIsPublic(!checked);
        toast.error(result.error || "Error al actualizar el estado");
      } else {
        toast.success(`Documentación ${checked ? 'pública' : 'privada'} correctamente.`);
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        {isPublic ? (
          <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none shadow-none">
            <Eye className="w-3 h-3" />
            Público
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none shadow-none">
            <EyeOff className="w-3 h-3" />
            Privado
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {isPending && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
        <Switch
          checked={isPublic}
          onCheckedChange={handleToggle}
          disabled={isPending}
          aria-label="Cambiar estado de privacidad"
        />
      </div>
    </div>
  );
}
