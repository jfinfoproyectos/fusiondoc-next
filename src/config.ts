export const GITHUB_CONFIG = {
  // Configuración de GitHub para modo Remoto
  // Estas variables se leen prioritariamente de .env.local
  owner: process.env.GITHUB_OWNER || 'jfinfotest',
  repo: process.env.GITHUB_REPO || 'prueba_doc',
  branch: process.env.GITHUB_BRANCH || 'main',
  docsPath: process.env.GITHUB_DOCS_PATH || 'docs',
};
