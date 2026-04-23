"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("No tienes permiso para realizar esta acción.");
  }
  return session;
}

export async function updateSettingsAction(data: {
  githubToken?: string | null;
  githubOwner?: string;
  githubRepo?: string;
  githubBranch?: string;
  githubDocsPath?: string;
  siteTitle?: string;
  siteLogo?: string;
  footerText?: string;
  socialLinks?: string;
  defaultTheme?: string;
  defaultAppearance?: string;
  defaultCodeTheme?: string;
  forceDefaultSettings?: boolean;
}) {
  await verifyAdmin();

  try {
    // Siempre trabajamos con el id: 1 (singleton)
    await prisma.systemSetting.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/settings");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error saving settings to DB:", error);
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      throw new Error("La base de datos no está lista. Asegúrate de ejecutar 'npx prisma db push' exitosamente.");
    }
    throw new Error("Error al guardar en la base de datos: " + error.message);
  }
}
