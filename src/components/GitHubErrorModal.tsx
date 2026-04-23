"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Key, RefreshCcw } from "lucide-react";
import DynamicIcon from "@/components/DynamicIcon";
import Link from "next/link";

interface GitHubErrorModalProps {
  errorType: "rate_limit" | "forbidden" | "not_found" | "other" | null;
  message?: string;
}

export function GitHubErrorModal({ errorType, message }: GitHubErrorModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (errorType) {
      setOpen(true);
    }
  }, [errorType]);

  if (!errorType) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] border-destructive/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-2xl font-black text-center tracking-tight">
            {errorType === "rate_limit" ? "Límite de GitHub Excedido" : "Error de Conexión con GitHub"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {errorType === "rate_limit" 
              ? "Has alcanzado el límite de solicitudes gratuitas de la API de GitHub. Esto sucede porque no hay un token de acceso configurado."
              : message || "No se pudo establecer conexión con el repositorio de GitHub."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-lg bg-primary/10 text-primary">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">¿Cómo solucionarlo?</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Añade un <strong>GITHUB_TOKEN</strong> en tu archivo <code className="bg-muted px-1 rounded">.env</code> o en el Panel de Administración para obtener un límite de hasta 5,000 solicitudes por hora.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-lg bg-primary/10 text-primary">
              <DynamicIcon icon="lucide:github" className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">Configuración Actual</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                El sistema está intentando conectar como usuario anónimo, lo que permite solo 60 solicitudes por hora compartidas entre todos los usuarios.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Link href="/dashboard/settings" className="w-full sm:flex-1">
            <Button className="w-full gap-2 rounded-xl font-bold py-6 shadow-lg shadow-primary/20">
              Ir a Configuración
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full sm:flex-1 rounded-xl font-bold py-6"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
