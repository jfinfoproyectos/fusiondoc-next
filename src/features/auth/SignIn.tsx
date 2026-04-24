"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail, GitBranch, Layers } from "lucide-react";
import { JSX, SVGProps, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getRedirectForSession, signInEmail, signInSocial } from "@/lib/auth-service";

const GoogleIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

export default function SignIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const target = getRedirectForSession(session);
    if (target) router.replace(target);
  }, [session, router]);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signInEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInSocial("google");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error con autenticación de Google");
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setLoading(true);
    try {
      await signInSocial("github");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error con autenticación de GitHub");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] text-white flex-col items-center justify-center p-16 relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-full h-full bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-full h-full bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 max-w-sm">
        <div className="relative z-10 text-center space-y-10 max-w-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
              <Layers className="text-primary-foreground h-6 w-6" />
            </div>
            <div className="space-y-2">
              <span className="text-2xl font-black tracking-tighter uppercase block">
                Fusion<span className="text-white">Doc</span>
              </span>
              <p className="text-white/60 text-xs font-black uppercase tracking-[0.4em]">
                Arquitectura del Conocimiento
              </p>
            </div>
          </div>
          
          <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
            La plataforma profesional para la gestión y distribución de documentación técnica.
          </p>
          
          <div className="flex justify-center gap-3 pt-4">
            {["Seguridad", "Velocidad", "Núcleo"].map((tag) => (
              <div
                key={tag}
                className="w-1.5 h-1.5 rounded-full bg-primary/40"
              />
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-sm space-y-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Layers className="text-primary-foreground h-4 w-4" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">
              Fusion<span className="text-primary">Doc</span>
            </span>
          </div>

          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-black tracking-tighter uppercase">Acceso</h1>
            <p className="text-muted-foreground/60 text-sm font-medium">
              Inicia sesión para gestionar tu base de conocimiento.
            </p>
          </div>

          <div className="space-y-4">
            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2 h-11 font-semibold"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <GoogleIcon className="h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-11 font-semibold"
                onClick={handleGithubSignIn}
                disabled={loading}
              >
                <GitBranch className="h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">o continúa con email</span>
              <Separator className="flex-1" />
            </div>

            {/* Email form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    id="email"
                    className="ps-9 h-11"
                    placeholder="tu@correo.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
                    disabled={loading}
                  />
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    className="ps-9 pe-9 h-11"
                    placeholder="Tu contraseña"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSignIn()}
                    disabled={loading}
                  />
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setIsVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}
            </div>

            <Button
              className="w-full h-11 font-semibold gap-2"
              onClick={handleEmailSignIn}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/signup" className="text-foreground font-semibold hover:underline underline-offset-4">
                Crear una cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
