import { GITHUB_CONFIG, SITE_CONFIG } from '@/config';
import matter from 'gray-matter';
import { cache } from 'react';
import { headers } from 'next/headers';
import prisma from "@/lib/prisma";

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

const contentCache = new Map<string, string>();

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Verifica si una fecha de frontmatter está en el futuro.
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
 */
export async function getGitTree(): Promise<{ sha: string; tree: GithubTreeItem[] } | null> {
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
 */
async function fetchBlobContent(sha: string): Promise<string | null> {
  const blobUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/git/blobs/${sha}`;
  
  const res = await fetch(blobUrl, {
    cache: 'no-store',
    headers: getGithubHeaders(),
  });
  if (!res.ok) return null;
  
  const data = await res.json();
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

/**
 * Obtiene el contenido de un archivo, usando caché si el SHA no cambió.
 */
export async function getFileContent(file: GithubTreeItem): Promise<{ content: string; fromCache: boolean } | null> {
  if (contentCache.has(file.sha)) {
    return { content: contentCache.get(file.sha)!, fromCache: true };
  }

  const content = await fetchBlobContent(file.sha);
  if (content) {
    contentCache.set(file.sha, content);
    return { content, fromCache: false };
  }
  return null;
}

// ============================================================
// PROJECTS (DYNAMIC VERSIONS)
// ============================================================

export const getAvailableProjects = cache(async function(): Promise<{ id: string, name: string, description?: string, icon?: string, order?: number, isPublic?: boolean }[]> {
  const parseProjectDir = async (dirname: string, indexFile?: GithubTreeItem) => {
    const cleanName = dirname.replace(/^\d+[-_]/, "").replace(/-/g, " ");
    let title = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    let description = "";
    let icon = "";
    let order = 99;

    let isPublic = !SITE_CONFIG.enableAuthDb; // Default to public if DB is disabled

    let hasDbOverride = false;
    
    if (SITE_CONFIG.enableAuthDb) {
      // Check database for overrides first
      const dbProject = await prisma.docProject.findUnique({ where: { id: dirname } });
      if (dbProject) {
        isPublic = dbProject.isPublic;
        hasDbOverride = true;
      }
    }

    if (indexFile) {
      try {
        const res = await getFileContent(indexFile);
        if (res) {
          const { data: frontmatter } = matter(res.content);
          if (frontmatter.title) title = frontmatter.title;
          if (frontmatter.description) description = frontmatter.description;
          if (frontmatter.icon) icon = frontmatter.icon;
          if (frontmatter.order !== undefined) order = frontmatter.order;
          // Only update isPublic from frontmatter if there is no DB override
          if (!hasDbOverride && frontmatter.public === true) isPublic = true;
        }
      } catch (e) {
        console.error(`Error parsing GitHub index.md for project ${dirname}:`, e);
      }
    }

    return { id: dirname, name: title, description, icon, order, isPublic };
  };

  const treeData = await getGitTree();
  if (!treeData) return [];

  const rootDirs = treeData.tree.filter(item => 
    item.type === 'tree' && 
    item.path.startsWith(`${GITHUB_CONFIG.docsPath}/`) &&
    item.path.replace(`${GITHUB_CONFIG.docsPath}/`, '').split('/').length === 1
  );

  const projectPromises = rootDirs.map(async (dir) => {
    const slug = dir.path.split('/').pop() || "";
    const indexPath = `${dir.path}/index.md`;
    const indexFile = treeData.tree.find(f => f.path === indexPath);
    return await parseProjectDir(slug, indexFile);
  });
  
  const results = await Promise.all(projectPromises);
  return results.filter(p => p.id).sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || a.id.localeCompare(b.id));
});

// ============================================================
// TOPICS (ROOT FOLDERS)
// ============================================================

export async function getTopics(version?: string): Promise<{ title: string; slug: string; order: number; icon?: string }[]> {
  const projects = await getAvailableProjects();
  const decodedVersion = version ? decodeURIComponent(version) : undefined;
  const effectiveVersion = decodedVersion || (projects.length > 0 ? projects[0].id : undefined);
  
  const treeData = await getGitTree();
  if (!treeData) return [];

  const effectiveDocsPath = effectiveVersion ? `${GITHUB_CONFIG.docsPath}/${effectiveVersion}` : GITHUB_CONFIG.docsPath;
  const rootFoldersMap = new Map<string, {title: string; order: number; icon?: string}>();
  
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
  const projects = await getAvailableProjects();
  const decodedVersion = version ? decodeURIComponent(version) : undefined;
  const decodedTopic = activeTopic ? decodeURIComponent(activeTopic) : undefined;
  const effectiveVersion = decodedVersion || (projects.length > 0 ? projects[0].id : undefined);
  
  try {
    const treeData = await getGitTree();
    if (!treeData) return [];

    const effectiveDocsPath = effectiveVersion ? `${GITHUB_CONFIG.docsPath}/${effectiveVersion}` : GITHUB_CONFIG.docsPath;
    const basePath = decodedTopic ? `${effectiveDocsPath}/${decodedTopic}/` : `${effectiveDocsPath}/`;
    
    const mdFiles = treeData.tree.filter(item => 
      item.type === 'blob' && 
      item.path.startsWith(basePath) && 
      item.path.endsWith('.md')
    );

    const groupsMap = new Map<string, { links: NavItem[]; indexHref?: string; icon?: string }>();
    const groupOrderMap = new Map<string, number>();

    const fetchPromises = mdFiles.map(async (file) => {
      const relPathInTopic = file.path.replace(basePath, '');
      const parts = relPathInTopic.split('/');
      const fileName = parts.pop() || '';
      const defaultCategory = parts.length > 0 ? parts[0] : 'General';
      
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

      const headersList = await headers();
      const projectId = headersList.get('x-project-id');
      const versionPrefix = (projectId === effectiveVersion) ? "" : `${effectiveVersion}/`;

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

export async function getDocContent(slugArray: string[] = []): Promise<DocResult | null> {
  let docResult: DocResult | null = null;
  let isIndex = false;

  const decodedSlugArray = slugArray.map(s => decodeURIComponent(s));
  let version = "";
  let realSlugArray = [...decodedSlugArray];

  const projects = await getAvailableProjects();

  if (projects.length > 0) {
    if (decodedSlugArray.length > 0 && projects.some(p => p.id === decodedSlugArray[0])) {
      version = decodedSlugArray[0];
      realSlugArray = decodedSlugArray.slice(1);
    } else {
      version = projects[0].id;
    }
  }

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

  if (docResult && isIndex) {
    const childrenMap = new Map<string, { title: string; href: string; description?: string; order?: number; icon?: string }>();
    
    const effectiveDocsPath = version ? `${GITHUB_CONFIG.docsPath}/${version}` : GITHUB_CONFIG.docsPath;
    const basePath = `${effectiveDocsPath}/${realSlugArray.join('/')}`;
    
    const directChildren = treeData.tree.filter(item => {
      if (!item.path.startsWith(basePath + '/')) return false;
      const relPath = item.path.replace(basePath + '/', '');
      if (relPath === "index.md") return false;
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

      if (item.type === 'tree' || (item.type === 'blob' && item.path.endsWith('/index.md'))) {
        const folderName = item.type === 'tree' ? name : parts[parts.length - 2];
        const indexPath = item.type === 'tree' ? `${item.path}/index.md` : item.path;
        const indexFile = treeData.tree.find(f => f.path === indexPath);
        
        if (indexFile) {
          const res = await getFileContent(indexFile);
          if (res) {
            const { data } = matter(res.content);
            const headersList = await headers();
            const projectId = headersList.get('x-project-id');
            const versionPrefix = (projectId === version) ? "" : `${version}/`;

            const cleanSlug = [...realSlugArray];
            if (cleanSlug[cleanSlug.length - 1] === "index") cleanSlug.pop();
            href = `/${versionPrefix}${[...cleanSlug, folderName].join('/')}`;
            title = data.title || title;
            description = data.description || "";
            order = data.order ?? order;
            icon = data.icon;
          }
        }
      } else if (item.type === 'blob' && item.path.endsWith('.md') && !item.path.endsWith('/index.md')) {
        const res = await getFileContent(item);
        if (res) {
          const { data } = matter(res.content);
          const headersList = await headers();
          const projectId = headersList.get('x-project-id');
          const versionPrefix = (projectId === version) ? "" : `${version}/`;

          const cleanSlug = [...realSlugArray];
          if (cleanSlug[cleanSlug.length - 1] === "index") cleanSlug.pop();
          href = `/${versionPrefix}${[...cleanSlug, name.replace(/\.md$/, "")].join('/')}`;
          title = data.title || title;
          description = data.description || "";
          order = data.order ?? order;
          icon = data.icon;
        }
      }

      if (href) {
        return { title: title.charAt(0).toUpperCase() + title.slice(1), href, description, order, icon };
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    
    // De-duplicate by href using the childrenMap
    results.filter((r): r is NonNullable<typeof r> => r !== null).forEach(item => {
      // Prioritize items that might have more info (like folder indexes)
      // or just keep the first one found.
      if (!childrenMap.has(item.href)) {
        childrenMap.set(item.href, item);
      }
    });

    docResult.children = Array.from(childrenMap.values()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  return docResult;
}
