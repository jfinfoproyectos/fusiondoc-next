"use server";

import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import matter from "gray-matter";
import * as adminService from "../../lib/admin-docs";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { getGithubConfig } from "../../config";
import React from "react";

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    throw new Error("No tienes permiso para realizar esta acción.");
  }
  return session;
}

export async function getFileTreeAction(projectId: string) {
  await verifyAdmin();
  return await adminService.getProjectFileTree(projectId);
}

export async function getFileContentAction(path: string) {
  await verifyAdmin();
  return await adminService.readFileContent(path);
}

export async function saveFileContentAction(path: string, content: string, sha?: string) {
  await verifyAdmin();
  const newSha = await adminService.saveFileContent(path, content, sha);
  revalidatePath("/(docs)", "layout");
  return { success: true, sha: newSha };
}

export async function createItemAction(parentPath: string, name: string, type: 'file' | 'folder') {
  await verifyAdmin();
  
  // Normalizar el parentPath asegurando que tenga el prefijo de la carpeta de docs de GitHub
  const githubConfig = await getGithubConfig();
  const docsPath = githubConfig.docsPath;
  const normalizedParent = parentPath.startsWith(docsPath + '/') 
    ? parentPath 
    : `${docsPath}/${parentPath}`;

  // Asegurar extensión .md para archivos
  const finalName = type === 'file' && !name.endsWith('.md') ? `${name}.md` : name;
  const path = `${normalizedParent}/${finalName}`;
  
  if (type === 'file') {
    await adminService.saveFileContent(path, "---\ntitle: " + name + "\n---");
  } else {
    // En GitHub, las carpetas se crean creando un archivo dentro (index.md)
    await adminService.saveFileContent(`${path}/index.md`, `---\ntitle: ${name}\norder: 99\n---`);
  }
  
  revalidatePath("/dashboard/admin/docs/[id]", "page");
  revalidatePath("/(docs)", "layout");
  return { success: true };
}

export async function deleteItemAction(path: string, sha: string) {
  await verifyAdmin();
  await adminService.deleteItem(path, sha);
  return { success: true };
}

export async function renameItemAction(path: string, newName: string, sha: string) {
  await verifyAdmin();
  await adminService.renameItem(path, newName, sha);
  return { success: true };
}

export async function createProjectAction(name: string) {
  await verifyAdmin();
  const id = await adminService.initNewProject(name);
  revalidatePath("/dashboard/docs");
  revalidatePath("/");
  return { success: true, id };
}

export async function renderMdxPreviewAction(content: string) {
  await verifyAdmin();
  
  // Normalizar saltos de línea y limpiar espacios extremos
  const normalized = content.replace(/\r\n/g, "\n").trim();
  
  let displayTitle = "";
  let mainContent = normalized;

  // Intento manual de extraer frontmatter si existe para asegurar limpieza absoluta
  if (normalized.startsWith("---")) {
    const segments = normalized.split("---");
    if (segments.length >= 3) {
      const yamlBlock = segments[1];
      mainContent = segments.slice(2).join("---").trim();
      
      // Extraer título del bloque YAML de forma robusta
      const titleMatch = yamlBlock.match(/^title:\s*(.*)$/m);
      if (titleMatch) {
        displayTitle = titleMatch[1].replace(/^['"]|['"]$/g, "").trim();
      }
    }
  }

  // Si no se encontró título con regex, intentar con gray-matter como fallback
  if (!displayTitle) {
    const matterResult = matter(normalized);
    displayTitle = matterResult.data.title || "";
    if (mainContent === normalized) {
      mainContent = matterResult.content.trim();
    }
  }

  return (
    <div className="mdx-preview-root">
      {displayTitle && (
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-6 md:mb-8">
          {displayTitle}
        </h1>
      )}
      <MarkdownRenderer content={mainContent} />
    </div>
  );
}

export async function moveItemAction(oldPath: string, newParentPath: string, sha: string) {
  await verifyAdmin();
  await adminService.moveItem(oldPath, newParentPath, sha);
  revalidatePath("/dashboard/admin/docs/[id]", "page");
  revalidatePath("/(docs)", "layout");
  return { success: true };
}
