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

import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import { remarkP5Sketch } from "@/lib/remark-p5";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getCodeTheme } from "./code-themes";

export async function renderMdxPreviewAction(content: string) {
  await verifyAdmin();
  
  const normalized = content.replace(/\r\n/g, "\n").trim();
  
  let displayTitle = "";
  let mainContent = normalized;

  if (normalized.startsWith("---")) {
    const segments = normalized.split("---");
    if (segments.length >= 3) {
      const yamlBlock = segments[1];
      mainContent = segments.slice(2).join("---").trim();
      const titleMatch = yamlBlock.match(/^title:\s*(.*)$/m);
      if (titleMatch) {
        displayTitle = titleMatch[1].replace(/^['"]|['"]$/g, "").trim();
      }
    }
  }

  if (!displayTitle) {
    const matterResult = matter(normalized);
    displayTitle = matterResult.data.title || "";
    if (mainContent === normalized) {
      mainContent = matterResult.content.trim();
    }
  }

  const codeTheme = await getCodeTheme();

  const mdxSource = await serialize(mainContent, {
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkP5Sketch],
      rehypePlugins: [
        rehypeSlug,
        [rehypePrettyCode, {
          theme: codeTheme,
          keepBackground: true,
        }],
      ],
    },
    parseFrontmatter: false,
  });

  return {
    success: true,
    displayTitle,
    mdxSource,
  };
}

export async function moveItemAction(oldPath: string, newParentPath: string, sha: string) {
  await verifyAdmin();
  await adminService.moveItem(oldPath, newParentPath, sha);
  revalidatePath("/dashboard/admin/docs/[id]", "page");
  revalidatePath("/(docs)", "layout");
  return { success: true };
}
