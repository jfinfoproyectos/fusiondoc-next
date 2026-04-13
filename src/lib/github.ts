import { GITHUB_CONFIG } from '@/config';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { cache } from 'react';

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// ============================================================
// TIPOS
// ============================================================

export type GithubTreeItem = {
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
  icon?: string;
};

export type NavGroup = {
  title: string;
  order?: number;
  links: NavItem[];
  indexHref?: string;
  icon?: string;
};

export type DocResult = {
  content: string;
  sha: string;
  fromCache: boolean;
  children?: { title: string; href: string; description?: string; order?: number; icon?: string }[];
};

// ============================================================
// CACHÉ EN MEMORIA POR SHA
// ============================================================
// Almacena el contenido raw de cada archivo indexado por su SHA.
// Si el SHA no cambió, el contenido es idéntico y no necesita re-descargarse.

const contentCache = new Map<string, string>();

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Verifica si una fecha de frontmatter (string YYYY-MM-DD o Date) está en el futuro.
 */
export function isFutureDate(dateVal?: string | Date): boolean {
  if (!dateVal) return false;
  try {
    const now = new Date();
    const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    
    let year, month, day;
    if (dateVal instanceof Date) {
      year = dateVal.getUTCFullYear();
      month = dateVal.getUTCMonth() + 1;
      day = dateVal.getUTCDate();
    } else {
      [year, month, day] = String(dateVal).split('T')[0].split('-').map(Number);
    }
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
    
    const postUTC = Date.UTC(year, month - 1, day);
    return postUTC > todayUTC;
  } catch {
    return false;
  }
}

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

// ============================================================
// TOPICS (ROOT FOLDERS)
// ============================================================

export async function getTopics(version?: string): Promise<{ title: string; slug: string; order: number; icon?: string }[]> {
  const localBase = process.env.LOCAL_DOCS_PATH;
  
  // Si hay versiones y no se especificó una, podríamos tomar la primera por defecto
  // Pero lo ideal es que quien lo llame sepa qué versión quiere.
  const effectiveVersion = version || (GITHUB_CONFIG.versions.length > 0 ? GITHUB_CONFIG.versions[0].id : undefined);
  
  if (localBase && fs.existsSync(localBase)) {
    try {
      const localPath = effectiveVersion ? path.join(localBase, effectiveVersion) : localBase;
      if (!fs.existsSync(localPath)) return [];

      const items = await readdir(localPath);
      const topics: { title: string; slug: string; order: number; icon?: string }[] = [];
      for (const item of items) {
        const fullPath = path.join(localPath, item);
        const s = await stat(fullPath);
        if (s.isDirectory()) {
          // Check for index.md for frontmatter info (title/order)
          const indexPath = path.join(fullPath, "index.md");
          let title = item.replace(/^\d+-/, "").replace(/-/g, " ");
          let order = 99;
          let icon: string | undefined = undefined;
          
          if (fs.existsSync(indexPath)) {
            try {
              const content = await readFile(indexPath, "utf-8");
              const { data: frontmatter } = matter(content);
              title = frontmatter.title || title;
              order = frontmatter.order ?? order;
              icon = frontmatter.icon;
            } catch {
              console.error(`Error reading index.md for topic ${item}`);
            }
          }
          
          topics.push({
            title: title.charAt(0).toUpperCase() + title.slice(1),
            slug: item,
            order,
            icon
          });
        }
      }
      return topics.sort((a, b) => a.order - b.order);
    } catch (err) {
      console.error("Error loading local topics:", err);
    }
  }

  // GitHub Fallback
  const treeData = await getGitTree();
  if (!treeData) return [];

  const effectiveDocsPath = effectiveVersion ? `${GITHUB_CONFIG.docsPath}/${effectiveVersion}` : GITHUB_CONFIG.docsPath;
  const rootFoldersMap = new Map<string, {title: string; order: number; icon?: string}>();
  
  // Find all directories at the root of the effective docs path
  const rootDirs = treeData.tree.filter(item => 
    item.type === 'tree' && 
    item.path.startsWith(effectiveDocsPath + '/') && 
    item.path.replace(effectiveDocsPath + '/', '').split('/').length === 1
  );

  for (const dir of rootDirs) {
    const slug = dir.path.split('/').pop() || "";
    if (!slug) continue;

    let title = slug.replace(/^\d+-/, "").replace(/-/g, " ");
    let order = 99;
    let icon: string | undefined = undefined;

    // Check if this directory has an index.md to get better metadata
    const indexPath = `${dir.path}/index.md`;
    const indexFile = treeData.tree.find(f => f.path === indexPath);
    if (indexFile) {
      const res = await getFileContent(indexFile);
      if (res) {
        const { data } = matter(res.content);
        title = data.title || title;
        order = data.order ?? order;
        icon = data.icon;
      }
    }

    rootFoldersMap.set(slug, {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      order,
      icon
    });
  }

  const topicsList = Array.from(rootFoldersMap.entries()).map(([slug, data]) => ({
    title: data.title,
    slug,
    order: data.order,
    icon: data.icon
  }));

  return topicsList.sort((a, b) => a.order - b.order);
}

// ============================================================
// NAVEGACIÓN (SIDEBAR)
// ============================================================

export const getNavigation = cache(async function(activeTopic?: string, version?: string): Promise<NavGroup[]> {
  const localBase = process.env.LOCAL_DOCS_PATH;
  const effectiveVersion = version || (GITHUB_CONFIG.versions.length > 0 ? GITHUB_CONFIG.versions[0].id : undefined);
  
  if (localBase && fs.existsSync(localBase)) {
    try {
      const groupsMap = new Map<string, { links: NavItem[]; indexHref?: string; icon?: string }>();
      const groupOrderMap = new Map<string, number>();

      const localPath = effectiveVersion ? path.join(localBase, effectiveVersion) : localBase;
      const docRoot = activeTopic ? path.join(localPath, activeTopic) : localPath;
      if (!fs.existsSync(docRoot)) return [];

      const scanDirectory = async (dir: string, baseRelative: string = "") => {
        const items = await readdir(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const relativeItem = path.join(baseRelative, item);
          const s = await stat(fullPath);

          if (s.isDirectory()) {
            await scanDirectory(fullPath, relativeItem);
          } else if (item.endsWith(".md")) {
            // Ignore index.md as it's the folder's landing page
            if (item === "index.md" && baseRelative === "") continue;

            const content = await readFile(fullPath, "utf-8");
            const { data: frontmatter } = matter(content);
            if (frontmatter.draft === true) continue;
            if (isFutureDate(frontmatter.date)) continue;

            const versionPrefix = effectiveVersion ? `${effectiveVersion}/` : "";
            const topicBase = activeTopic ? `${activeTopic}/` : "";
            let slugPath = relativeItem.replace(/\.md$/, "").replace(/\\/g, "/");
            if (slugPath.endsWith("/index")) slugPath = slugPath.replace(/\/index$/, "");
            if (slugPath === "index") slugPath = "";
            const slug = `${versionPrefix}${topicBase}${slugPath}`;
            
            const parts = relativeItem.replace(/\\/g, "/").split("/");
            const fileName = parts.pop() || "";
            
            // Subfolder name is the category
            const defaultCategory = parts.length > 0 ? parts[parts.length - 1] : "General";

            const title = frontmatter.title || fileName.replace(/-/g, " ");
            const category = frontmatter.category || defaultCategory;
            const order = frontmatter.order || 99;
            const catOrder = frontmatter.categoryOrder || 99;
            const icon = frontmatter.icon;

            if (!groupsMap.has(category)) {
              groupsMap.set(category, { links: [] });
              groupOrderMap.set(category, catOrder);
            }
            
            if (item === "index.md") {
              groupsMap.get(category)!.indexHref = `/${slug}`;
              // Si el index.md tiene icono y categoría personalizada, lo tomamos como el icono de la categoría principal si existe
              if (icon) groupsMap.get(category)!.icon = icon;
            } else {
              groupsMap.get(category)!.links.push({ title, href: `/${slug}`, order, icon });
            }
          }
        }
      };

      await scanDirectory(docRoot);

      const navGroups: NavGroup[] = [];
      groupsMap.forEach((data, categoryTitle) => {
        data.links.sort((a, b) => (a.order || 0) - (b.order || 0));
        navGroups.push({
          title: categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1).replace(/-/g, " ").replace(/^\d+-/, ""),
          order: groupOrderMap.get(categoryTitle),
          links: data.links,
          indexHref: data.indexHref,
          icon: data.icon,
        });
      });
      navGroups.sort((a, b) => {
        if (a.title.toLowerCase() === 'general') return -1;
        if (b.title.toLowerCase() === 'general') return 1;
        return (a.order || 0) - (b.order || 0);
      });
      return navGroups;
    } catch (err) {
      console.error("Error loading local navigation:", err);
    }
  }

  // GitHub Navigation with unified parity
  try {
    const treeData = await getGitTree();
    if (!treeData) return [];

    const effectiveDocsPath = effectiveVersion ? `${GITHUB_CONFIG.docsPath}/${effectiveVersion}` : GITHUB_CONFIG.docsPath;
    const basePath = activeTopic ? `${effectiveDocsPath}/${activeTopic}/` : `${effectiveDocsPath}/`;
    
    // Filter all .md files in the subtree of the current topic/path
    const mdFiles = treeData.tree.filter(item => 
      item.type === 'blob' && 
      item.path.startsWith(basePath) && 
      item.path.endsWith('.md')
    );

    const groupsMap = new Map<string, { links: NavItem[]; indexHref?: string; icon?: string }>();
    const groupOrderMap = new Map<string, number>();

    const fetchPromises = mdFiles.map(async (file) => {
      // Relative path within the topic
      const relPathInTopic = file.path.replace(basePath, '');
      const parts = relPathInTopic.split('/');
      const fileName = parts.pop() || '';
      
      // Categoría por defecto basada en la primera carpeta después del tópico
      const defaultCategory = parts.length > 0 ? parts[0] : 'General';
      
      // Ignorar index.md en el nivel raíz del tópico (es el landing del tópico)
      if (fileName === "index.md" && parts.length === 0) return;

      const result = await getFileContent(file);
      if (!result) return;
      const { data: frontmatter } = matter(result.content);
      if (frontmatter.draft === true || isFutureDate(frontmatter.date)) return;

      const title = frontmatter.title || fileName.replace(/\.md$/, '').replace(/-/g, ' ');
      const category = frontmatter.category || defaultCategory;
      const order = frontmatter.order || 99;
      const catOrder = frontmatter.categoryOrder || 99;
      const icon = frontmatter.icon;

      // URL base: /v1/topic/path/to/slug
      const versionPrefix = effectiveVersion ? `${effectiveVersion}/` : "";
      const topicBase = activeTopic ? `${activeTopic}/` : "";
      let slugPath = relPathInTopic.replace(/\.md$/, "");
      if (slugPath.endsWith("/index")) slugPath = slugPath.replace(/\/index$/, "");
      if (slugPath === "index") slugPath = "";
      const href = `/${versionPrefix}${topicBase}${slugPath}`;

      if (!groupsMap.has(category)) {
        groupsMap.set(category, { links: [] });
        groupOrderMap.set(category, catOrder);
      }

      const group = groupsMap.get(category)!;

      if (fileName === "index.md") {
        group.indexHref = href;
        if (icon) group.icon = icon;
      } else {
        group.links.push({ title, href, order, icon });
      }
    });

    await Promise.all(fetchPromises);

    const navGroups: NavGroup[] = [];
    groupsMap.forEach((data, categoryTitle) => {
      data.links.sort((a, b) => (a.order || 99) - (b.order || 99));
      navGroups.push({
        title: categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1).replace(/-/g, " ").replace(/^\d+-/, ""),
        order: groupOrderMap.get(categoryTitle) ?? 99,
        links: data.links,
        indexHref: data.indexHref,
        icon: data.icon,
      });
    });

    navGroups.sort((a, b) => {
      if (a.title.toLowerCase() === 'general') return -1;
      if (b.title.toLowerCase() === 'general') return 1;
      return (a.order || 99) - (b.order || 99);
    });

    return navGroups;
  } catch (error) {
    console.error('Error global en getNavigation (GitHub):', error);
    return [];
  }
});

// ============================================================
// CONTENIDO DE PÁGINA INDIVIDUAL
// ============================================================

/**
 * Obtiene el contenido de un documento específico por su slug.
 * Usa el árbol de GitHub para verificar el SHA antes de descargar.
 */
export async function getDocContent(slugArray: string[] = []): Promise<DocResult | null> {
  const localBase = process.env.LOCAL_DOCS_PATH;
  let docResult: DocResult | null = null;
  let isIndex = false;
  let currentDir = "";

  // Determinar versión y slug real
  let version = "";
  let realSlugArray = [...slugArray];

  if (GITHUB_CONFIG.versions.length > 0) {
    if (slugArray.length > 0 && GITHUB_CONFIG.versions.some(v => v.id === slugArray[0])) {
      version = slugArray[0];
      realSlugArray = slugArray.slice(1);
    } else {
      // Si no hay versión en el slug pero se requieren versiones, tomamos la primera por defecto
      version = GITHUB_CONFIG.versions[0].id;
    }
  }

  if (localBase && fs.existsSync(localBase)) {
    const localPath = version ? path.join(localBase, version) : localBase;
    const targetPath = path.join(localPath, ...realSlugArray);
    let localFile = targetPath + ".md";
    currentDir = targetPath;
    
    if (!fs.existsSync(localFile)) {
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            localFile = path.join(targetPath, "index.md");
            isIndex = true;
        }
    } else if (localFile.endsWith("index.md")) {
        isIndex = true;
        currentDir = path.dirname(localFile);
    }

    if (fs.existsSync(localFile)) {
      try {
        const content = await readFile(localFile, "utf-8");
        const s = await stat(localFile);
        docResult = {
          content,
          sha: s.mtimeMs.toString(),
          fromCache: false,
        };
      } catch (err) {
        console.error("Error reading local file:", err);
      }
    }
  } else {
    // GitHub logic
    const treeData = await getGitTree();
    if (!treeData) return null;

    const effectiveDocsPath = version ? `${GITHUB_CONFIG.docsPath}/${version}` : GITHUB_CONFIG.docsPath;
    const basePath = `${effectiveDocsPath}/${realSlugArray.join('/')}`;
    let filePath = `${basePath.replace(/\/$/, '')}.md`;
    if (realSlugArray.length === 0) filePath = `${effectiveDocsPath}/index.md`;

    let file = treeData.tree.find((item) => item.type === 'blob' && item.path === filePath);

    if (!file) {
      filePath = `${basePath.replace(/\/$/, '')}/index.md`;
      file = treeData.tree.find((item) => item.type === 'blob' && item.path === filePath);
      if (file) isIndex = true;
    }

    if (file) {
      const result = await getFileContent(file);
      if (result) {
        docResult = {
          content: result.content,
          sha: file.sha,
          fromCache: result.fromCache,
        };
      }
    }
  }

  // Si es un índice, poblar hijos
  if (docResult && isIndex) {
    const childrenMap = new Map<string, { title: string; href: string; description?: string; order?: number; icon?: string }>();
    
    if (localBase && fs.existsSync(localBase)) {
      const items = await readdir(currentDir);
      for (const item of items) {
        if (item === "index.md") continue;
        const fullPath = path.join(currentDir, item);
        const s = await stat(fullPath);
        
        let title = item.replace(/^\d+-/, "").replace(/\.md$/, "").replace(/-/g, " ");
        let description = "";
        let order = 99;
        let href = "";
        let icon: string | undefined = undefined;

        if (s.isDirectory()) {
          const childIndexPath = path.join(fullPath, "index.md");
          if (fs.existsSync(childIndexPath)) {
            const content = await readFile(childIndexPath, "utf-8");
            const { data } = matter(content);
            if (data.draft === true || isFutureDate(data.date)) continue;
            title = data.title || title;
            description = data.description || "";
            order = data.order ?? order;
            icon = data.icon;
            const versionPrefix = version ? `${version}/` : "";
            const cleanSlug = [...realSlugArray];
            if (cleanSlug[cleanSlug.length - 1] === "index") cleanSlug.pop();
            href = `/${versionPrefix}${[...cleanSlug, item].join("/")}`;
          } else {
            continue; // Skip dirs without index.md
          }
        } else if (item.endsWith(".md")) {
          const content = await readFile(fullPath, "utf-8");
          const { data } = matter(content);
          if (data.draft === true || isFutureDate(data.date)) continue;
          title = data.title || title;
          description = data.description || "";
          order = data.order ?? order;
          icon = data.icon;
          const versionPrefix = version ? `${version}/` : "";
          const cleanSlug = [...realSlugArray];
          if (cleanSlug[cleanSlug.length - 1] === "index") cleanSlug.pop();
          href = `/${versionPrefix}${[...cleanSlug, item.replace(/\.md$/, "")].join("/")}`;
        }

        if (href && !childrenMap.has(href)) {
          childrenMap.set(href, { 
            title: title.charAt(0).toUpperCase() + title.slice(1), 
            href, 
            description, 
            order,
            icon
          });
        }
      }
    } else {
      // GitHub children logic
      const treeData = await getGitTree();
      if (treeData) {
        const effectiveDocsPath = version ? `${GITHUB_CONFIG.docsPath}/${version}` : GITHUB_CONFIG.docsPath;
        const basePath = `${effectiveDocsPath}/${realSlugArray.join('/')}`;
        
        // Find children: blobs or trees that start with basePath/ and are exactly one level deeper
        const directChildren = treeData.tree.filter(item => {
          if (!item.path.startsWith(basePath + '/')) return false;
          const relPath = item.path.replace(basePath + '/', '');
          
          // No incluir el propio archivo index.md del nivel actual
          if (relPath === "index.md") return false;

          // Si es un archivo MD directo o una carpeta (tree)
          return !relPath.includes('/') || (relPath.endsWith('/index.md') && relPath.split('/').length === 2);
        });

        const fetchPromises = directChildren.map(async (item) => {
          const relPath = item.path.replace(basePath + '/', '');
          const parts = relPath.split('/');
          const name = parts[0];
          
          let title = name.replace(/^\d+-/, "").replace(/\.md$/, "").replace(/-/g, " ");
          let description = "";
          let order = 99;
          let icon: string | undefined = undefined;
          let href = "";

          // URL generation logic (reutilizable)
          const versionPrefix = version ? `${version}/` : "";
          const cleanSlug = [...realSlugArray];
          if (cleanSlug[cleanSlug.length - 1] === "index") cleanSlug.pop();

          if (item.type === 'tree' || (item.type === 'blob' && item.path.endsWith('/index.md'))) {
            // Es una subcarpeta
            const folderName = item.type === 'tree' ? name : parts[parts.length - 2];
            const indexPath = item.type === 'tree' ? `${item.path}/index.md` : item.path;
            const indexFile = treeData.tree.find(f => f.path === indexPath);
            
            if (indexFile) {
              const res = await getFileContent(indexFile);
              if (res) {
                const { data } = matter(res.content);
                if (data.draft === true || isFutureDate(data.date)) return null;
                title = data.title || title;
                description = data.description || "";
                order = data.order ?? order;
                icon = data.icon;
                href = `/${versionPrefix}${[...cleanSlug, folderName].join('/')}`;
              }
            } else {
              // Sin index.md localmente se salta, aquí también
              return null;
            }
          } else if (item.type === 'blob' && item.path.endsWith('.md') && !item.path.endsWith('/index.md')) {
            // Es un documento MD
            const res = await getFileContent(item);
            if (res) {
              const { data } = matter(res.content);
              if (data.draft === true || isFutureDate(data.date)) return null;
              title = data.title || title;
              description = data.description || "";
              order = data.order ?? order;
              icon = data.icon;
              href = `/${versionPrefix}${[...cleanSlug, name.replace(/\.md$/, "")].join('/')}`;
            }
          }

          if (href) {
            return { title: title.charAt(0).toUpperCase() + title.slice(1), href, description, order, icon };
          }
          return null;
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(r => { 
          if(r && !childrenMap.has(r.href)) {
            childrenMap.set(r.href, r);
          }
        });
      }
    }
    
    docResult.children = Array.from(childrenMap.values()).sort((a, b) => {
      if (a.title.toLowerCase() === 'general') return -1;
      if (b.title.toLowerCase() === 'general') return 1;
      return (a.order || 99) - (b.order || 99);
    });
  }

  return docResult;
}

// Explicit exports for search engine
export { getGitTree, getFileContent };
