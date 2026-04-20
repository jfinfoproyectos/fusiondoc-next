import { authClient } from "./auth-client";

type Session = Awaited<ReturnType<typeof authClient.useSession>>["data"];

/**
 * Determina hacia dónde redirigir según la sesión del usuario.
 * Los admins y usuarios van al dashboard de grupos.
 */
export function getRedirectForSession(session: Session): string | null {
  if (!session?.user) return null;
  return "/dashboard/groups";
}

export async function signInEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { error } = await authClient.signIn.email({ email, password });
  if (error) {
    throw new Error(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
  }
}

export async function signUpEmail({
  email,
  password,
  confirmPassword,
  name,
}: {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}) {
  if (password !== confirmPassword) {
    throw new Error("Las contraseñas no coinciden.");
  }
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const { error } = await authClient.signUp.email({
    email,
    password,
    name: name || email.split("@")[0],
  });

  if (error) {
    throw new Error(error.message || "Error al crear la cuenta. Intenta con otro correo.");
  }
}

export async function signInSocial(provider: "google" | "github") {
  const { error } = await authClient.signIn.social({
    provider,
    callbackURL: "/dashboard/groups",
  });
  if (error) {
    throw new Error(error.message || `Error al iniciar sesión con ${provider}`);
  }
}
