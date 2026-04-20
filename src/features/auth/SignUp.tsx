"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, FileText } from "lucide-react";
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
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-background/20 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 rounded-full bg-background/10 blur-2xl" />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-background/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-background" />
            </div>
            <span className="text-3xl font-black tracking-tight text-background">FusionDoc</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight text-background">
            Únete a la plataforma
          </h2>
          <p className="text-background/60 text-lg leading-relaxed">
            Crea tu cuenta para acceder a documentación exclusiva, unirte a grupos de trabajo y colaborar con tu equipo.
          </p>
          <div className="flex flex-col gap-3 pt-4 text-left">
            {[
              { icon: "📄", text: "Acceso a documentación técnica" },
              { icon: "👥", text: "Únete a grupos de trabajo" },
              { icon: "🔒", text: "Acceso seguro con JWT" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-background/70">
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden mb-4">
            <FileText className="w-6 h-6" />
            <span className="text-xl font-black">FusionDoc</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Crear cuenta</h1>
            <p className="text-muted-foreground">
              Regístrate para empezar a usar FusionDoc.
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
