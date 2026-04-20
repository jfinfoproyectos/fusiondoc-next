"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function toggleDocPublicStatus(id: string, isPublic: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session || session.user.role !== "admin") {
    throw new Error("No tienes permiso para realizar esta acción.");
  }

  try {
    await prisma.docProject.upsert({
      where: { id },
      update: { isPublic },
      create: { id, isPublic },
    });

    revalidatePath("/dashboard/docs");
    revalidatePath("/"); // También revalidar home por si se muestran las docs públicas
    
    return { success: true };
  } catch (error) {
    console.error("Error toggling doc public status:", error);
    return { success: false, error: "No se pudo actualizar el estado de la documentación." };
  }
}
