"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 shrink-0" />
        <FileQuestion className="h-24 w-24 text-primary relative z-10 mx-auto" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-6xl font-black tracking-tighter text-foreground mb-4">
        404
      </h1>
      
      <h2 className="text-2xl font-bold text-foreground/80 mb-4">
        Página no encontrada
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-10 leading-relaxed">
        Lo sentimos, no pudimos encontrar el documento que buscas. 
        Es posible que haya sido movido, eliminado o que el enlace sea incorrecto.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" size="lg" className="rounded-full px-8">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Ir al Inicio
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="rounded-full px-8 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </div>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-left">
        <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
          <h3 className="font-bold text-foreground mb-2 italic underline decoration-primary/30">¿Buscabas la página de inicio?</h3>
          <p className="text-sm text-muted-foreground">
            Asegúrate de que el archivo <code className="bg-muted px-1 rounded text-primary">docs/index.md</code> existe en tu repositorio de GitHub.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
          <h3 className="font-bold text-foreground mb-2 italic underline decoration-primary/30">¿Algo más no funciona?</h3>
          <p className="text-sm text-muted-foreground">
            Revisa la navegación en el panel de la izquierda para encontrar otros documentos disponibles.
          </p>
        </div>
      </div>
    </div>
  );
}
