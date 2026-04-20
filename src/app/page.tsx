import Link from 'next/link';
import { ArrowRight, BookOpen, ShieldCheck, Zap, Layers } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import DynamicIcon from '@/components/DynamicIcon';
import { ModeToggle } from '@/components/mode-toggle';
import { CreditsButton } from '@/components/CreditsButton';
import { getAvailableThemes } from "@/app/actions/themes";
import { ThemeSelector } from "@/components/ThemeSelector";
import { SITE_CONFIG } from "@/config";
import { getAvailableProjects } from '@/lib/github';
import { getOrBuildSearchIndex } from '@/lib/search';
import { redirect } from 'next/navigation';
import { getCodeTheme } from '@/app/actions/code-themes';
import { CodeThemeSelector } from '@/components/CodeThemeSelector';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const availableThemes = await getAvailableThemes();
  const allProjects = await getAvailableProjects();
  const publicProjects = allProjects.filter(p => p.isPublic);
  const isAuthenticated = !!session;
  const currentCodeTheme = await getCodeTheme();

  // Proactive indexing trigger
  void getOrBuildSearchIndex();

  // Public Mode Redirection
  if (!SITE_CONFIG.enableAuthDb) {
    if (allProjects.length === 1) {
      redirect(`/${allProjects[0].id}`);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* ─── Elementos de Fondo Abstractos ─────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[110px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        
        {/* Patrón de malla sutil */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ─── Navbar Minimalista ───────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
            <Layers className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">
            Fusion<span className="text-primary">Doc</span>
          </span>
        </div>

        <div className="flex-1" />

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2 mr-2">
              {!SITE_CONFIG.defaultTheme && (
                <ThemeSelector themes={availableThemes} defaultTheme={SITE_CONFIG.defaultTheme} />
              )}
              {!SITE_CONFIG.defaultCodeTheme && (
                <CodeThemeSelector currentTheme={currentCodeTheme} />
              )}
              {!SITE_CONFIG.defaultAppearance && <ModeToggle />}
            </div>
            {SITE_CONFIG.enableAuthDb && (
              !isAuthenticated ? (
                <Link 
                  href="/signin" 
                  className="px-5 py-2.5 rounded-full text-sm font-bold bg-secondary hover:bg-secondary/80 transition-colors border border-border"
                >
                  Iniciar sesión
                </Link>
              ) : (
                <Link 
                  href="/dashboard/groups" 
                  className="px-5 py-2.5 rounded-full text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  Panel de Control
                </Link>
              )
            )}
          </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-12 md:py-24">
        
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Documentación de Próxima Generación</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          CONDUCE EL <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/40">
            CONOCIMIENTO
          </span>
        </h1>

        {/* Descripción */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          {SITE_CONFIG.enableAuthDb 
            ? "Centraliza la documentación técnica de todos tus proyectos bajo una capa de seguridad robusta basada en grupos. Sincronización dinámica y despliegue instantáneo."
            : "Centraliza y publica tu documentación técnica directamente desde Markdown. Navega por nuestros proyectos y descubre guías detalladas listas para usar."}
        </p>

        {/* Call to Action Principal */}
        {SITE_CONFIG.enableAuthDb ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            {!isAuthenticated ? (
              <Link 
                href="/signin" 
                className="group h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Comenzar ahora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link 
                href="/dashboard/groups" 
                className="group h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Ver mis Grupos
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            
            <Link 
              href="/dashboard/groups" 
              className="h-16 px-10 rounded-2xl border border-border bg-background/50 backdrop-blur-md font-bold text-lg flex items-center justify-center hover:bg-accent transition-all duration-300"
            >
              Explorar grupos
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link 
              href="#public-grid"
              className="group h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Documentación Disponible
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* ─── Cursos Públicos ─────────────────────────────────── */}
        {publicProjects.length > 0 && (
          <div id="public-grid" className="w-full mt-24 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-400">
            <div className="flex flex-col items-center mb-10 text-center">
               <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 uppercase italic">
                 Documentación <span className="text-primary">Abierta</span>
               </h2>
               <div className="h-1 w-20 bg-primary/20 rounded-full" />
               <p className="mt-4 text-muted-foreground text-sm font-medium">Explora nuestros recursos públicos disponibles para toda la comunidad.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto w-full px-4 sm:px-0 mt-8">
               {publicProjects.map((project) => (
                 <Link 
                   key={project.id} 
                   href={`/${project.id}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="group p-8 rounded-[2.5rem] bg-card/40 border border-border/50 backdrop-blur-xl hover:border-primary/40 hover:bg-card/60 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex flex-col items-center text-center overflow-hidden relative w-full sm:w-[400px] min-h-[300px]"
                 >
                   <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity scale-150 rotate-12">
                      <DynamicIcon icon={project.icon || "lucide:book-open"} width="120" height="120" />
                   </div>
                   
                   <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-inner">
                     <DynamicIcon icon={project.icon || "lucide:book-open"} width="32" height="32" />
                   </div>
                   
                   <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
                   {project.description && (
                     <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed mb-8 font-medium">
                       {project.description}
                     </p>
                   )}
                   
                   <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all duration-300">
                      <span>Explorar contenido</span>
                      <ArrowRight className="h-3 w-3" />
                   </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        {/* ─── Características (Features Preview) ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 md:mt-32 w-full text-left animate-in fade-in zoom-in duration-1000 delay-500">
          
          <div className="p-8 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-md hover:border-primary/20 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Seguridad por Grupos</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Control total sobre quién accede a cada carpeta de documentación mediante inscripciones aprobadas.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-md hover:border-primary/20 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Cero Latencia</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tus archivos Markdown se renderizan al instante con optimización de caché avanzada para lectura fluida.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-md hover:border-primary/20 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight">Multiversión Ready</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gestiona múltiples documentaciones y productos desde una única interfaz centralizada y moderna.
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
          <a href="#" className="hover:text-primary transition-colors">Markdown Engine</a>
          <a href="#" className="hover:text-primary transition-colors">Group Access</a>
          <a href="#" className="hover:text-primary transition-colors">Architecture</a>
        </div>
        <div className="text-[10px] font-mono">
           Powered by Next.js 16 & Turbopack
        </div>
      </footer>
    </div>
  );
}
