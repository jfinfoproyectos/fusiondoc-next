import { GITHUB_CONFIG } from '@/config';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// ============================================================
// TIPOS
// ============================================================

type GithubTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
};

export type NavItem = {
  title: string;
  href: string;
  order?: number;
};

export type NavGroup = {
  title: string;
  order?: number;
  links: NavItem[];
};

export type DocResult = {
  content: string;
  sha: string;
  fromCache: boolean;
};

// ============================================================
// CACHÉ EN MEMORIA POR SHA
// ============================================================
// Almacena el contenido raw de cada archivo indexado por su SHA.
// Si el SHA no cambió, el contenido es idéntico y no necesita re-descargarse.

const contentCache = new Map<string, string>();

// Almacena el último SHA conocido del árbol completo del repo.
// Si el SHA del árbol no cambió, toda la estructura es idéntica.
let lastTreeSha: string | null = null;
let cachedNavigation: NavGroup[] | null = null;

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Genera los headers para las solicitudes a la API de GitHub.
 * Si hay un GITHUB_TOKEN en .env, lo incluye para subir el rate limit
 * de 60 req/h (sin token) a 5,000 req/h (con token).
 */
function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Fusiondoc-Next-App',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Obtiene el árbol completo del repositorio de GitHub.
 * Esta llamada es ligera y siempre se hace para detectar cambios.
 */
async function getGitTree(): Promise<{ sha: string; tree: GithubTreeItem[] } | null> {
  const treeUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/git/trees/${GITHUB_CONFIG.branch}?recursive=1`;
  
  const res = await fetch(treeUrl, {
    cache: 'no-store',
    headers: getGithubHeaders(),
  });

  if (!res.ok) {
    console.error('No se pudo obtener el árbol de GitHub:', res.status);
    return null;
  }

  const data = await res.json();
  return { sha: data.sha, tree: data.tree || [] };
}

/**
 * Descarga el contenido de un archivo usando la API de Git Blobs.
 * Esto evita el CDN de raw.githubusercontent.com que cachea hasta 5 minutos.
 * Al usar el SHA directamente, obtenemos el contenido exacto sin retrasos.
 */
async function fetchBlobContent(sha: string): Promise<string | null> {
  const blobUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/git/blobs/${sha}`;
  
  const res = await fetch(blobUrl, {
    cache: 'no-store',
    headers: getGithubHeaders(),
  });
  if (!res.ok) return null;
  
  const data = await res.json();
  // El contenido viene en base64
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

/**
 * Obtiene el contenido de un archivo, usando caché si el SHA no cambió.
 * Devuelve también si el contenido vino de caché o fue descargado fresco.
 */
async function getFileContent(file: GithubTreeItem): Promise<{ content: string; fromCache: boolean } | null> {
  // Si ya tenemos este SHA en caché, el contenido es idéntico → no descargar
  if (contentCache.has(file.sha)) {
    return { content: contentCache.get(file.sha)!, fromCache: true };
  }

  // SHA nuevo o cambiado → descargar contenido fresco via API Blobs
  const content = await fetchBlobContent(file.sha);
  if (content) {
    contentCache.set(file.sha, content);
    return { content, fromCache: false };
  }
  return null;
}

// ============================================================
// NAVEGACIÓN (SIDEBAR)
// ============================================================

export async function getNavigation(): Promise<NavGroup[]> {
  const localPath = process.env.LOCAL_DOCS_PATH;
  if (localPath && fs.existsSync(localPath)) {
    try {
      const groupsMap = new Map<string, NavItem[]>();
      const groupOrderMap = new Map<string, number>();

      const scanDirectory = async (dir: string, baseRelative: string = "") => {
        const items = await readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const relativeItem = path.join(baseRelative, item);
          const s = await stat(fullPath);

          if (s.isDirectory()) {
            await scanDirectory(fullPath, relativeItem);
          } else if (item.endsWith(".md")) {
            const content = await readFile(fullPath, "utf-8");
            const { data: frontmatter } = matter(content);
            if (frontmatter.draft === true) continue;

            const slug = relativeItem.replace(/\.md$/, "").replace(/\\/g, "/");
            const parts = slug.split("/");
            const fileName = parts.pop() || "";
            const defaultCategory = parts.length > 0 ? parts[0] : "General";

            const title = frontmatter.title || fileName.replace(/-/g, " ");
            const category = frontmatter.category || defaultCategory;
            const order = frontmatter.order || 99;
            const catOrder = frontmatter.categoryOrder || 99;

            if (!groupsMap.has(category)) {
              groupsMap.set(category, []);
              groupOrderMap.set(category, catOrder);
            }
            groupsMap.get(category)?.push({ title, href: `/${slug}`, order });
          }
        }
      };

      await scanDirectory(localPath);

      const navGroups: NavGroup[] = [];
      groupsMap.forEach((links, categoryTitle) => {
        links.sort((a, b) => (a.order || 0) - (b.order || 0));
        navGroups.push({
          title: categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1),
          order: groupOrderMap.get(categoryTitle),
          links,
        });
      });
      navGroups.sort((a, b) => (a.order || 0) - (b.order || 0));
      return navGroups;
    } catch (err) {
      console.error("Error loading local navigation:", err);
    }
  }

  try {
    const treeData = await getGitTree();
    if (!treeData) return cachedNavigation || [];

    // Si el SHA del árbol no cambió, toda la estructura es idéntica → usar caché
    if (treeData.sha === lastTreeSha && cachedNavigation) {
      return cachedNavigation;
    }

    // El árbol cambió → reconstruir navegación
    lastTreeSha = treeData.sha;

    const mdFiles = treeData.tree.filter(item =>
      item.type === 'blob' &&
      item.path.startsWith(GITHUB_CONFIG.docsPath + '/') &&
      item.path.endsWith('.md')
    );

    const groupsMap = new Map<string, NavItem[]>();
    const groupOrderMap = new Map<string, number>();

    const fetchPromises = mdFiles.map(async (file) => {
      const relPath = file.path.replace(GITHUB_CONFIG.docsPath + '/', '');
      const parts = relPath.split('/');
      const fileName = parts.pop() || '';
      const slug = relPath.replace(/\.md$/, '');
      const defaultCategory = parts.length > 0 ? parts[0] : 'General';

      const result = await getFileContent(file);
      if (!result) return;

      const { data: frontmatter } = matter(result.content);

      // Ignorar borradores
      if (frontmatter.draft === true) return;

      // Ignorar publicaciones programadas (fecha futura)
      if (frontmatter.date) {
        // Comparar ambas fechas en UTC para evitar problemas de timezone
        const now = new Date();
        const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const [year, month, day] = String(frontmatter.date).split('-').map(Number);
        const postUTC = Date.UTC(year, month - 1, day);
        if (postUTC > todayUTC) return;
      }

      const title = frontmatter.title || fileName.replace(/\.md$/, '').replace(/-/g, ' ');
      const category = frontmatter.category || defaultCategory;
      const order = frontmatter.order || 99;
      const catOrder = frontmatter.categoryOrder || 99;

      if (!groupsMap.has(category)) {
        groupsMap.set(category, []);
        groupOrderMap.set(category, catOrder);
      }

      groupsMap.get(category)?.push({ title, href: `/${slug}`, order });
    });

    await Promise.all(fetchPromises);

    const navGroups: NavGroup[] = [];
    groupsMap.forEach((links, categoryTitle) => {
      links.sort((a, b) => (a.order || 0) - (b.order || 0));
      navGroups.push({
        title: categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1),
        order: groupOrderMap.get(categoryTitle),
        links,
      });
    });
    navGroups.sort((a, b) => (a.order || 0) - (b.order || 0));

    cachedNavigation = navGroups;
    return navGroups;

  } catch (error) {
    console.error('Error global en getNavigation', error);
    return cachedNavigation || [];
  }
}

// ============================================================
// CONTENIDO DE PÁGINA INDIVIDUAL
// ============================================================

/**
 * Obtiene el contenido de un documento específico por su slug.
 * Usa el árbol de GitHub para verificar el SHA antes de descargar.
 */
export async function getDocContent(slugArray: string[] = ['index']): Promise<DocResult | null> {
  const localBase = process.env.LOCAL_DOCS_PATH;
  if (localBase && fs.existsSync(localBase)) {
    const localFile = path.join(localBase, ...slugArray) + ".md";
    if (fs.existsSync(localFile)) {
      try {
        const content = await readFile(localFile, "utf-8");
        const s = await stat(localFile);
        return {
          content,
          sha: s.mtimeMs.toString(), // Use modification time as SHA for local dev
          fromCache: false,
        };
      } catch (err) {
        console.error("Error reading local file:", err);
      }
    }
  }

  const filePath = `${GITHUB_CONFIG.docsPath}/${slugArray.join('/')}.md`;

  const treeData = await getGitTree();
  if (!treeData) return null;

  // Buscar el archivo en el árbol
  const file = treeData.tree.find(
    (item) => item.type === 'blob' && item.path === filePath
  );

  if (!file) return null;

  // Devuelve contenido cacheado si el SHA no cambió, o descarga si es nuevo
  const result = await getFileContent(file);
  if (!result) return null;
  
  return {
    content: result.content,
    sha: file.sha,
    fromCache: result.fromCache,
  };
}
