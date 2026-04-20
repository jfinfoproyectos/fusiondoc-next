import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ],
});

// Exportar hooks útiles para usar en componentes de React
export const {
  useSession,
  signIn,
  signOut,
  signUp,
} = authClient;
