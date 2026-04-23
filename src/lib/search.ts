import { create, insert, search, type AnyOrama } from '@orama/orama';
import { getGitTree, getFileContent, getAvailableProjects } from './github';
import { getGithubConfig } from '@/config';
import matter from 'gray-matter';

let oramaDb: AnyOrama | null = null;
let lastIndexed: number = 0;
let indexingPromise: Promise<AnyOrama> | null = null;
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
  
  if (oramaDb && (now - lastIndexed < INDEX_CACHE_DURATION) && !indexingPromise) {
    return oramaDb;
  }

  if (indexingPromise) {
    console.log('[Search] Waiting for current indexing process to complete...');
    return indexingPromise;
  }

  console.log('[Search] Starting fresh indexing process...');
  indexingPromise = buildIndex();
  
  try {
    const freshDb = await indexingPromise;
    oramaDb = freshDb;
    lastIndexed = Date.now();
    return oramaDb;
  } finally {
    indexingPromise = null;
  }
}

async function buildIndex() {
  const db = await create({
    schema: {
      title: 'string',
      content: 'string',
      topic: 'string',
      url: 'string',
      version: 'string',
    },
  });

  console.log(`[Search] Mode: REMOTE ONLY (GitHub)`);
  await indexRemoteDocs(db);

  return db;
}

async function indexRemoteDocs(db: AnyOrama) {
  console.log('[Search] Indexing remote docs from GitHub...');
  const treeData = await getGitTree();
  if (!treeData) return;

  const githubConfig = await getGithubConfig();
  const docsPath = githubConfig.docsPath || 'docs';
  const mdFiles = treeData.tree.filter(item => 
    item.type === 'blob' && 
    item.path.startsWith(`${docsPath}/`) &&
    item.path.endsWith('.md')
  );

  const { projects } = await getAvailableProjects();
  const BATCH_SIZE = 15; 
  
  for (let i = 0; i < mdFiles.length; i += BATCH_SIZE) {
    const batch = mdFiles.slice(i, i + BATCH_SIZE);
    
    await Promise.all(batch.map(async (file) => {
      try {
        const result = await getFileContent(file);
        if (!result) return;

        const { data: frontmatter, content } = matter(result.content);
        if (frontmatter.draft) return;

        const relPath = file.path.replace(new RegExp(`^${docsPath}/`), '');
        const parts = relPath.split('/');
        
        let version = "";
        let topic = "";
        let slug = "";

        if (projects.some((p: {id: string}) => p.id === parts[0])) {
          version = parts[0];
          topic = parts[1] || "";
          slug = relPath.replace(/\.md$/, '').replace(/\/index$/, '');
        } else {
          topic = parts[0];
          slug = relPath.replace(/\.md$/, '').replace(/\/index$/, '');
        }

        await insert(db, {
          title: frontmatter.title || file.path.split('/').pop()?.replace(/\.md$/, '') || '',
          content: stripMdx(content),
          topic: topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' '),
          url: `/${slug}`,
          version: version || "global",
        });
      } catch (err) {
        console.error(`[Search] Error indexing remote file ${file.path}:`, err);
      }
    }));
  }
  console.log('[Search] Remote indexing complete.');
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
