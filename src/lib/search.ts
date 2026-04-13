import { create, insert, search, type AnyOrama } from '@orama/orama';
import { getGitTree, getFileContent, getTopics, type GithubTreeItem } from './github';
import { GITHUB_CONFIG, VersionConfig } from '@/config';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

let oramaDb: AnyOrama | null = null;
let lastIndexed: number = 0;
const INDEX_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export interface SearchResult {
  title: string;
  content: string;
  url: string;
  topic: string;
  version?: string;
}

/**
 * Strips MDX/Markdown tags to get clean text for indexing
 */
function stripMdx(content: string): string {
  return content
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links
    .replace(/#+\s+/g, '') // Headings
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/>\s+/g, '') // Quotes
    .replace(/<[^>]+>/g, '') // HTML/JSX tags
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ') // Multiple spaces
    .trim();
}

/**
 * Core function to build or retrieve the cached Orama index
 */
export async function getOrBuildSearchIndex() {
  const now = Date.now();
  if (oramaDb && (now - lastIndexed < INDEX_CACHE_DURATION)) {
    return oramaDb;
  }

  oramaDb = await create({
    schema: {
      title: 'string',
      content: 'string',
      topic: 'string',
      url: 'string',
      version: 'string',
    },
  });

  const localPath = process.env.LOCAL_DOCS_PATH;
  const isLocal = localPath && fs.existsSync(localPath);

  if (isLocal) {
    await indexLocalDocs(localPath);
  } else {
    await indexRemoteDocs();
  }

  lastIndexed = Date.now();
  return oramaDb;
}

async function indexLocalDocs(root: string) {
  const scanDir = async (dir: string) => {
    const items = await readdir(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const s = await stat(fullPath);

      if (s.isDirectory()) {
        await scanDir(fullPath);
      } else if (item.endsWith('.md')) {
        const rawContent = await readFile(fullPath, 'utf-8');
        const { data: frontmatter, content } = matter(rawContent);
        
        if (frontmatter.draft) continue;

        const relPath = path.relative(root, fullPath).replace(/\\/g, '/');
        const parts = relPath.split('/');
        
        let version = "";
        let topic = "";
        let slug = "";

        const versions = GITHUB_CONFIG.versions;
        if (versions.some((v: VersionConfig) => v.id === parts[0])) {
          version = parts[0];
          topic = parts[1] || "";
          slug = relPath.replace(/\.md$/, '').replace(/\/index$/, '');
        } else {
          topic = parts[0];
          slug = relPath.replace(/\.md$/, '').replace(/\/index$/, '');
        }
        
        await insert(oramaDb!, {
          title: frontmatter.title || item.replace(/\.md$/, ''),
          content: stripMdx(content),
          topic: topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' '),
          url: `/${slug}`,
          version: version,
        });
      }
    }
  };

  await scanDir(root);
}

async function indexRemoteDocs() {
  const treeData = await getGitTree();
  if (!treeData) return;

  const mdFiles = treeData.tree.filter(item => 
    item.type === 'blob' && item.path.endsWith('.md')
  );

  for (const file of mdFiles) {
    const rawContent = await getFileContent(file);
    if (!rawContent) continue;

    const { data: frontmatter, content } = matter(rawContent.content);
    if (frontmatter.draft) continue;

    const docsPath = process.env.GITHUB_DOCS_PATH || 'docs';
    const relPath = file.path.replace(new RegExp(`^${docsPath}/`), '');
    const parts = relPath.split('/');
    
    let version = "";
    let topic = "";
    let slug = "";

    const versions = GITHUB_CONFIG.versions;
    if (versions.some((v: VersionConfig) => v.id === parts[0])) {
      version = parts[0];
      topic = parts[1] || "";
      slug = relPath.replace(/\.md$/, '').replace(/\/index$/, '');
    } else {
      topic = parts[0];
      slug = relPath.replace(/\.md$/, '').replace(/\/index$/, '');
    }

    await insert(oramaDb!, {
      title: frontmatter.title || file.path.split('/').pop()?.replace(/\.md$/, '') || '',
      content: stripMdx(content),
      topic: topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' '),
      url: `/${slug}`,
      version: version,
    });
  }
}

export async function performSearch(query: string, version?: string) {
  const db = await getOrBuildSearchIndex();
  
  const searchParams: any = {
    term: query,
    properties: ['title', 'content', 'topic'],
    boost: {
      title: 2,
      topic: 1.2,
    },
    limit: 10,
  };

  if (version) {
    searchParams.where = {
      version: version,
    };
  }

  const results = await search(db, searchParams);

  return results.hits.map((hit: any) => hit.document as SearchResult);
}
