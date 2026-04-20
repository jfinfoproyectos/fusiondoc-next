/**
 * doc-access.ts
 * Helpers server-side para determinar si un usuario puede acceder
 * a una carpeta de documentación específica.
 *
 * Reglas:
 *  1. Toda la documentación requiere autenticación.
 *  2. Si una carpeta NO está asignada a ningún grupo → cualquier usuario autenticado puede acceder.
 *  3. Si una carpeta ESTÁ asignada a uno o más grupos → solo usuarios con membresía APPROVED en alguno de esos grupos.
 */

import prisma from "@/lib/prisma";
import { SITE_CONFIG } from "@/config";

export interface DocAccessResult {
  /** El usuario está autenticado */
  authenticated: boolean;
  /** El usuario puede leer esta carpeta */
  allowed: boolean;
  /** La carpeta está protegida por al menos un grupo */
  protected: boolean;
  /** Grupos que dan acceso a esta carpeta (para mostrar al usuario sin acceso) */
  grantingGroups: { id: string; name: string }[];
  /** Estado de membresía del usuario en cada grupo que da acceso */
  membershipStatus: Record<string, "APPROVED" | "PENDING" | "REJECTED" | null>;
}

/**
 * Calcula si el usuario tiene acceso a una carpeta de docs.
 * @param folderId  - Nombre de la carpeta (primer segmento del slug), ej: "FusionDoc"
 * @param userId    - ID del usuario autenticado (null si no hay sesión)
 */
export async function getDocAccess(
  folderId: string,
  userId: string | null
): Promise<DocAccessResult> {
  // Bypass if Auth/DB is disabled
  if (!SITE_CONFIG.enableAuthDb) {
    return {
      authenticated: true,
      allowed: true,
      protected: false,
      grantingGroups: [],
      membershipStatus: {},
    };
  }

  // 1. Buscar grupos que controlan esta carpeta
  const grantingGroups = await prisma.group.findMany({
    where: { docFolders: { has: folderId } },
    select: { id: true, name: true },
  });

  const isProtected = grantingGroups.length > 0;

  if (!userId) {
    return {
      authenticated: false,
      allowed: false,
      protected: isProtected,
      grantingGroups,
      membershipStatus: {},
    };
  }

  // 2. Si la carpeta no está protegida → cualquier usuario autenticado puede acceder
  if (!isProtected) {
    return {
      authenticated: true,
      allowed: true,
      protected: false,
      grantingGroups: [],
      membershipStatus: {},
    };
  }

  // 3. Verificar membresías del usuario en los grupos que dan acceso
  const groupIds = grantingGroups.map((g) => g.id);
  const memberships = await prisma.groupMembership.findMany({
    where: { userId, groupId: { in: groupIds } },
    select: { groupId: true, status: true },
  });

  const membershipStatus: Record<string, "APPROVED" | "PENDING" | "REJECTED" | null> = {};
  for (const g of grantingGroups) {
    const m = memberships.find((mb) => mb.groupId === g.id);
    membershipStatus[g.id] = (m?.status ?? null) as "APPROVED" | "PENDING" | "REJECTED" | null;
  }

  const hasApproved = memberships.some((m) => m.status === "APPROVED");

  return {
    authenticated: true,
    allowed: hasApproved,
    protected: true,
    grantingGroups,
    membershipStatus,
  };
}

/**
 * Devuelve los IDs de carpetas de docs a los que el usuario tiene acceso.
 * - Si la carpeta no está asignada a ningún grupo → accesible (si está autenticado).
 * - Si está asignada → solo si tiene APPROVED en algún grupo de esa carpeta.
 *
 * @param userId            - ID del usuario (null si no hay sesión → ninguna carpeta)
 * @param allFolderIds      - Todos los IDs de carpetas disponibles en el sistema
 */
export async function getAccessibleFolderIds(
  userId: string | null,
  allFolderIds: string[]
): Promise<string[]> {
  // Bypass if Auth/DB is disabled
  if (!SITE_CONFIG.enableAuthDb) return allFolderIds;

  if (!userId) return [];

  // Grupos donde el usuario tiene membresía aprobada
  const approvedMemberships = await prisma.groupMembership.findMany({
    where: { userId, status: "APPROVED" },
    select: { group: { select: { docFolders: true } } },
  });

  const approvedFolders = new Set(
    approvedMemberships.flatMap((m) => m.group.docFolders)
  );

  // Carpetas que están bajo el control de algún grupo
  const controlledGroups = await prisma.group.findMany({
    where: { docFolders: { isEmpty: false } },
    select: { docFolders: true },
  });
  const controlledFolders = new Set(controlledGroups.flatMap((g) => g.docFolders));

  return allFolderIds.filter((folderId) => {
    const isControlled = controlledFolders.has(folderId);
    if (!isControlled) return true;           // Libre para cualquier autenticado
    return approvedFolders.has(folderId);     // Solo si tiene APPROVED
  });
}
