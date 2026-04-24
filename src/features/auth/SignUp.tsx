"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getRedirectForSession, signUpEmail } from "@/lib/auth-service";

export default function SignUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const target = getRedirectForSession(session);
    if (target) router.replace(target);
  }, [session, router]);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUpEmail({ email, password, confirmPassword, name });
      setSuccess(true);
      setTimeout(() => router.push("/signin"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
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
            Únete a la plataforma líder para la distribución de conocimiento técnico y colaboración profesional.
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
            <h1 className="text-3xl font-black tracking-tighter uppercase">Registro</h1>
            <p className="text-muted-foreground/60 text-sm font-medium">
              Crea tu cuenta para empezar a organizar tu documentación.
            </p>
          </div>

          {success ? (
            <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center space-y-2">
              <p className="text-2xl">✅</p>
              <p className="font-semibold text-green-800 dark:text-green-300">¡Cuenta creada con éxito!</p>
              <p className="text-sm text-muted-foreground">Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">completa tus datos</span>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      className="ps-9 h-11"
                      placeholder="Tu nombre"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Input
                      id="email"
                      className="ps-9 h-11"
                      placeholder="tu@correo.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        className="ps-9 pe-9 h-11"
                        placeholder="Mín. 8 caracteres"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setIsVisible((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        className="ps-9 pe-9 h-11"
                        placeholder="Repite"
                        type={isVisibleConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setIsVisibleConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isVisibleConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/signin" className="text-foreground font-semibold hover:underline underline-offset-4">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
