import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  // Configuración de base de datos
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Configuración de email y contraseña
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  // Proveedores sociales (solo se habilitan si existen las credenciales)
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    } : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    } : {}),
  },

  // Configuración de sesión
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24,      // Actualizar cada 24 horas
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutos
    },
  },

  // Plugin admin (gestiona role, banned, banReason, banExpires, impersonatedBy)
  // defaultRole: el rol asignado automáticamente a cada nuevo usuario
  plugins: [
    nextCookies(),
    admin({ defaultRole: "user" }),
  ],

  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean),
});