"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

// ─── Admin: CRUD de Grupos ────────────────────────────────────────────────────

export async function createGroupAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado. Solo los administradores pueden crear grupos.");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const docFolder = formData.get("docFolder") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name?.trim()) throw new Error("El nombre del grupo es requerido.");

  await prisma.group.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
      registrationOpen: true,
      docFolder: docFolder?.trim() || null,
    },
  });

  revalidatePath("/dashboard/groups");
}

export async function updateGroupAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado.");
  }

  const groupId = formData.get("groupId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const registrationOpen = formData.get("registrationOpen") === "true";
  const docFolder = formData.get("docFolder") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!groupId) throw new Error("ID de grupo requerido.");

  await prisma.group.update({
    where: { id: groupId },
    data: {
      name: name?.trim() || undefined,
      description: description?.trim() || null,
      imageUrl: imageUrl?.trim() || null,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
      registrationOpen,
      docFolder: docFolder?.trim() || null,
    },
  });

  revalidatePath("/dashboard/groups");
}

export async function deleteGroupAction(groupId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado.");
  }

  await prisma.group.delete({ where: { id: groupId } });
  revalidatePath("/dashboard/groups");
}

export async function toggleGroupRegistrationAction(groupId: string, isOpen: boolean) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado.");
  }

  await prisma.group.update({
    where: { id: groupId },
    data: { registrationOpen: isOpen },
  });

  revalidatePath("/dashboard/groups");
}

// ─── User: Solicitar inscripción ──────────────────────────────────────────────

export async function requestGroupJoinAction(groupId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Debes iniciar sesión para inscribirte.");
  }

  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) throw new Error("Grupo no encontrado.");
  if (!group.registrationOpen) throw new Error("Las inscripciones están cerradas.");

  // Check if already member or pending
  const existing = await prisma.groupMembership.findUnique({
    where: { userId_groupId: { userId: session.user.id, groupId } },
  });

  if (existing) {
    if (existing.status === "APPROVED") throw new Error("Ya eres miembro de este grupo.");
    if (existing.status === "PENDING") throw new Error("Tu solicitud ya está pendiente.");
    if (existing.status === "REJECTED") {
      // Allow re-applying if rejected
      await prisma.groupMembership.update({
        where: { id: existing.id },
        data: { status: "PENDING" },
      });
      revalidatePath("/dashboard/groups");
      return;
    }
  }

  await prisma.groupMembership.create({
    data: {
      userId: session.user.id,
      groupId,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/groups");
}

// ─── Admin: Gestión de solicitudes ───────────────────────────────────────────

export async function approveGroupMembershipAction(membershipId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado.");
  }

  await prisma.groupMembership.update({
    where: { id: membershipId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/dashboard/groups");
}

export async function rejectGroupMembershipAction(membershipId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado.");
  }

  await prisma.groupMembership.update({
    where: { id: membershipId },
    data: { status: "REJECTED" },
  });

  revalidatePath("/dashboard/groups");
}

export async function removeGroupMemberAction(userId: string, groupId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    throw new Error("No autorizado.");
  }

  await prisma.groupMembership.deleteMany({
    where: { userId, groupId },
  });

  revalidatePath(`/dashboard/groups/${groupId}`);
  revalidatePath("/dashboard/groups");
}
