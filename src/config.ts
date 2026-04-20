export const SITE_CONFIG = {
  title: process.env.SITE_TITLE || 'FusionDoc',
  logo: process.env.SITE_LOGO || 'lucide:package',
  defaultTheme: process.env.DEFAULT_THEME || null,
  defaultCodeTheme: process.env.DEFAULT_CODE_THEME || null,
  defaultAppearance: process.env.DEFAULT_APPEARANCE || null,
  enableAuthDb: process.env.ENABLE_AUTH_DB !== 'false',
};

export const GITHUB_CONFIG = {
  // Configuración de GitHub para modo Remoto
  // Estas variables se leen prioritariamente de .env.local
  owner: process.env.GITHUB_OWNER || 'jfinfotest',
  repo: process.env.GITHUB_REPO || 'prueba_doc',
  branch: process.env.GITHUB_BRANCH || 'main',
  docsPath: process.env.GITHUB_DOCS_PATH || 'docs',
  // Las versiones ("proyectos") ahora se obtienen dinámicamente escaneando las carpetas
};
