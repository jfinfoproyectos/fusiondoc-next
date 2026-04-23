import { getGithubConfig } from '@/config';
import { getGitTree, GithubTreeItem } from './github';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  sha?: string;
  children?: FileNode[];
}

/**
 * Auxiliar para generar headers de GitHub
 */
function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Fusiondoc-Next-Admin',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  return headers;
}

/**
 * Transforma el árbol plano de GitHub en una estructura anidada para el explorador
 */
export async function getProjectFileTree(projectId: string): Promise<FileNode[]> {
  const treeData = await getGitTree();
  if (!treeData) return [];

  // Decode projectId in case it comes URL encoded (common with accents like 'móviles')
  const decodedId = decodeURIComponent(projectId);
  const githubConfig = await getGithubConfig();
  const projectPrefix = `${githubConfig.docsPath}/${decodedId}/`;
  
  const projectItems = treeData.tree.filter(item => item.path.startsWith(projectPrefix));

  const root: FileNode[] = [];
  const map: Record<string, FileNode> = {};

  // Primero creamos todos los nodos
  projectItems.forEach(item => {
    const relPath = item.path.replace(projectPrefix, '');
    if (!relPath) return; // Saltamos el nodo raíz del proyecto

    const node: FileNode = {
      name: relPath.split('/').pop() || '',
      path: item.path,
      type: item.type === 'tree' ? 'folder' : 'file',
      sha: item.sha,
      children: item.type === 'tree' ? [] : undefined
    };

    map[item.path] = node;
  });

  // Luego construimos la jerarquía
  projectItems.forEach(item => {
    const relPath = item.path.replace(projectPrefix, '');
    if (!relPath) return;

    const parts = relPath.split('/');
    if (parts.length === 1) {
      root.push(map[item.path]);
    } else {
      const parentRelPath = parts.slice(0, -1).join('/');
      const parentAbsPath = `${projectPrefix}${parentRelPath}`;
      const parent = map[parentAbsPath];
      if (parent && parent.children) {
        parent.children.push(map[item.path]);
      }
    }
  });

  // Ordenar: Carpetas primero, luego archivos
  const sortNodes = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });
    nodes.forEach(n => n.children && sortNodes(n.children));
  };

  sortNodes(root);
  return root;
}

/**
 * Obtiene el contenido de un archivo
 */
export async function readFileContent(path: string): Promise<{ content: string; sha: string }> {
  const githubConfig = await getGithubConfig();
  const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}?ref=${githubConfig.branch}`;
  
  const res = await fetch(url, {
    cache: 'no-store',
    headers: getGithubHeaders(),
  });

  if (!res.ok) throw new Error(`Error al leer archivo de GitHub: ${res.status}`);

  const data = await res.json();
  return {
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
    sha: data.sha
  };
}

/**
 * Guarda o crea un archivo en GitHub
 */
export async function saveFileContent(path: string, content: string, sha?: string): Promise<string> {
  const githubConfig = await getGithubConfig();
  const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`;
  
  const body: any = {
    message: `Docs: ${sha ? 'Update' : 'Create'} ${path.split('/').pop()}`,
    content: Buffer.from(content).toString('base64'),
    branch: githubConfig.branch
  };

  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: getGithubHeaders(),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`GitHub Error: ${error.message}`);
  }

  const data = await res.json();
  return data.content.sha;
}

/**
 * Elimina un archivo o carpeta (recursivo es complejo en Git, por ahora archivos individuales)
 */
export async function deleteItem(path: string, sha: string): Promise<void> {
  const githubConfig = await getGithubConfig();
  const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`;
  
  const body = {
    message: `Docs: Delete ${path.split('/').pop()}`,
    sha: sha,
    branch: githubConfig.branch
  };

  const res = await fetch(url, {
    method: 'DELETE',
    headers: getGithubHeaders(),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`GitHub Error: ${error.message}`);
  }
}

/**
 * Inicializa un nuevo proyecto creando su index.md
 */
export async function initNewProject(name: string): Promise<string> {
  const projectId = name.replace(/\s+/g, '-').toLowerCase();
  const githubConfig = await getGithubConfig();
  const filePath = `${githubConfig.docsPath}/${projectId}/index.md`;
  
  const content = `---\ntitle: ${name}\ndescription: Documentación creada vía GitHub Admin Panel\nicon: lucide:book\norder: 1\n---`;
  
  await saveFileContent(filePath, content);
  return projectId;
}

/**
 * Renombrar: Fetch -> Create en nueva ruta -> Delete vieja ruta
 */
export async function renameItem(oldPath: string, newName: string, sha: string): Promise<string> {
  const fileData = await readFileContent(oldPath);
  const parentFolder = oldPath.split('/').slice(0, -1).join('/');
  const newPath = `${parentFolder}/${newName}`;
  
  await saveFileContent(newPath, fileData.content);
  await deleteItem(oldPath, sha);
  
  return newPath;
}
/**
 * Mover: Fetch -> Create en nueva ruta -> Delete vieja ruta
 */
export async function moveItem(oldPath: string, newParentPath: string, sha: string): Promise<string> {
  const fileData = await readFileContent(oldPath);
  const fileName = oldPath.split('/').pop() || '';
  const newPath = `${newParentPath}/${fileName}`;
  
  await saveFileContent(newPath, fileData.content);
  await deleteItem(oldPath, sha);
  
  return newPath;
}
