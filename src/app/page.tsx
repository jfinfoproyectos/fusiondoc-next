import Link from 'next/link';
import { ArrowRight, BookOpen, ShieldCheck, Zap, Layers } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import DynamicIcon from '@/components/DynamicIcon';
import { ModeToggle } from '@/components/mode-toggle';
import { CreditsButton } from '@/components/CreditsButton';
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeSelector } from "@/components/ThemeSelector";
import { getSiteConfig } from "@/config";
import { getAvailableProjects } from '@/lib/github';
import { getOrBuildSearchIndex } from '@/lib/search';
import { redirect } from 'next/navigation';
import { getCodeTheme } from '@/app/actions/code-themes';
import { CodeThemeSelector } from '@/components/CodeThemeSelector';

import { GitHubErrorModal } from '@/components/GitHubErrorModal';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const availableThemes = await getAvailableThemes();
  const { projects: allProjects, error: githubError } = await getAvailableProjects();
  const publicProjects = allProjects.filter(p => p.isPublic);
  const isAuthenticated = !!session;
  const currentCodeTheme = await getCodeTheme();

  // Proactive indexing trigger
  void getOrBuildSearchIndex();

  // Public Mode Redirection
  const siteConfig = await getSiteConfig();
  if (!siteConfig.enableAuthDb) {
    if (allProjects.length === 1) {
      redirect(`/${allProjects[0].id}`);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col">
      <GitHubErrorModal errorType={githubError} />
      {/* ─── Elementos de Fondo Abstractos ─────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[160px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[160px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        
        {/* Patrón de puntos sutil en lugar de malla pesada */}
        <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* ─── Navbar Minimalista ───────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-300">
            <Layers className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic">
            Fusion<span className="text-primary">Doc</span>
          </span>
        </div>

        <div className="flex-1" />

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2 mr-2">
              {!siteConfig.forceDefaultSettings && (
                <>
                  <ThemeSelector themes={availableThemes} defaultTheme={siteConfig.defaultTheme} forceDefaultSettings={siteConfig.forceDefaultSettings} />
                  <CodeThemeSelector currentTheme={currentCodeTheme} />
                  <ModeToggle />
                </>
              )}
            </div>
            {siteConfig.enableAuthDb && (
              !isAuthenticated ? (
                <Link 
                  href="/signin" 
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-secondary hover:bg-secondary/80 transition-colors border border-border/50"
                >
                  Entrar
                </Link>
              ) : (
                <Link 
                  href="/dashboard/groups" 
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  Panel
                </Link>
              )
            )}
          </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-12 md:py-20">
        
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Base de Conocimiento Profesional</span>
        </div>

        {/* Título Principal - Más elegante */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          CONECTA TU <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            CONOCIMIENTO
          </span>
        </h1>

        {/* Descripción - Más general */}
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {siteConfig.enableAuthDb 
            ? "La plataforma moderna para centralizar, proteger y compartir documentación técnica. Gestión de accesos inteligente y despliegue inmediato."
            : "Explora y consulta documentación técnica de alta calidad. Tu punto de acceso centralizado a recursos de conocimiento especializados."}
        </p>

        {/* Call to Action Principal */}
        {siteConfig.enableAuthDb ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            {!isAuthenticated ? (
              <Link 
                href="/signin" 
                className="group h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:translate-y-[-2px] active:scale-95 transition-all duration-300"
              >
                Empezar ahora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link 
                href="/dashboard/groups" 
                className="group h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:translate-y-[-2px] active:scale-95 transition-all duration-300"
              >
                Ir al Panel
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            
            <Link 
              href="/dashboard/groups" 
              className="h-14 px-8 rounded-2xl border border-border bg-background/50 backdrop-blur-md font-black text-sm uppercase tracking-widest flex items-center justify-center hover:bg-accent transition-all duration-300"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              href="#public-grid"
              className="group h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/25 hover:translate-y-[-2px] active:scale-95 transition-all duration-300"
            >
              Ver Documentación
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* ─── Cursos Públicos ─────────────────────────────────── */}
        {publicProjects.length > 0 && (
          <div id="public-grid" className="w-full mt-24 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-400">
            <div className="flex flex-col items-center mb-12 text-center">
               <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2 uppercase">
                 Explora el <span className="text-primary">Contenido</span>
               </h2>
               <div className="h-1 w-12 bg-primary/20 rounded-full" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto w-full px-4 sm:px-0 mt-8">
               {publicProjects.map((project) => (
                 <Link 
                   key={project.id} 
                   href={`/${project.id}`}
                   className="group p-6 rounded-[2rem] bg-card/30 border border-border/40 backdrop-blur-xl hover:border-primary/30 hover:bg-card/50 transition-all duration-500 shadow-sm flex flex-col items-center text-center overflow-hidden relative w-full sm:w-[320px] min-h-[260px]"
                 >
                   <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity scale-150 rotate-12">
                      <DynamicIcon icon={project.icon || "lucide:book-open"} width="100" height="100" />
                   </div>
                   
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-all duration-500">
                     <DynamicIcon icon={project.icon || "lucide:book-open"} width="24" height="24" />
                   </div>
                   
                   <h3 className="text-base font-black mb-3 tracking-tight group-hover:text-primary transition-colors uppercase">{project.name}</h3>
                   {project.description && (
                     <p className="text-[10px] text-muted-foreground/70 line-clamp-2 leading-relaxed mb-6 font-medium">
                       {project.description}
                     </p>
                   )}
                   
                   <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary group-hover:gap-3 transition-all duration-300">
                      <span>Acceder</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                   </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        {/* ─── Características (Features Preview) ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 md:mt-32 w-full text-left animate-in fade-in zoom-in duration-1000 delay-500">
          
          <div className="p-8 rounded-[2rem] bg-card/20 border border-border/30 backdrop-blur-sm hover:border-primary/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:rotate-6 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black mb-2 tracking-tight uppercase">Privacidad</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Gestión avanzada de accesos mediante grupos e inscripciones.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-card/20 border border-border/30 backdrop-blur-sm hover:border-primary/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:rotate-6 transition-transform">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black mb-2 tracking-tight uppercase">Velocidad</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Renderizado instantáneo de Markdown con optimización dinámica.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-card/20 border border-border/30 backdrop-blur-sm hover:border-primary/20 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:rotate-6 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black mb-2 tracking-tight uppercase">Control</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Estructura tu conocimiento de forma profesional y escalable.
            </p>
          </div>

        </div>
      </main>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-6 py-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full text-muted-foreground/60">
        <div className="flex items-center gap-2">
           <Layers className="h-4 w-4" />
           <span className="text-xs font-bold tracking-tighter uppercase">FusionDoc © 2026</span>
        </div>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest font-black">
          <a href="#" className="hover:text-primary transition-colors">Motor Markdown</a>
          <a href="#" className="hover:text-primary transition-colors">Acceso por Grupos</a>
          <a href="#" className="hover:text-primary transition-colors">Arquitectura</a>
        </div>
        <div className="text-[10px] font-mono">
           Desarrollado con Next.js 16 & Turbopack
        </div>
      </footer>
    </div>
  );
}
