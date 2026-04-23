import * as dotenv from 'dotenv';
dotenv.config();

async function checkTree() {
  const owner = process.env.GITHUB_OWNER || 'jfinfotest';
  const repo = process.env.GITHUB_REPO || 'fuciondoct1';
  const branch = process.env.GITHUB_BRANCH || 'main';
  const docsPath = process.env.GITHUB_DOCS_PATH || 'docs';
  
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Fusiondoc-Next-Admin-Check',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  console.log('Fetching URL:', treeUrl);
  const res = await fetch(treeUrl, { headers });
  if (!res.ok) {
    console.error('Error fetching tree:', res.status, await res.text());
    return;
  }

  const data = await res.json();
  const paths = data.tree.map(item => item.path);
  console.log('All paths in docs/:');
  const docsItems = paths.filter(p => p.startsWith(docsPath + '/'));
  if (docsItems.length === 0) {
    console.log(' (No items found in docs/)');
  } else {
    docsItems.forEach(p => console.log(' - ' + p));
  }
}

checkTree();
