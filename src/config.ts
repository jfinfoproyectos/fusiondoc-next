export const SITE_CONFIG = {
  title: process.env.SITE_TITLE || 'FusionDoc',
  logo: process.env.SITE_LOGO || 'lucide:package',
  footer: process.env.FOOTER || '',
  footerLinks: (() => {
    try {
      return process.env.FOOTER_LINKS ? JSON.parse(process.env.FOOTER_LINKS) : [];
    } catch {
      return [];
    }
  })() as { name: string; url: string; icon: string }[],
  defaultTheme: process.env.DEFAULT_THEME || null,
  defaultCodeTheme: process.env.DEFAULT_CODE_THEME || null,
  defaultAppearance: process.env.DEFAULT_APPEARANCE || null,
};

export interface VersionConfig {
  id: string;
  name?: string;
  description?: string;
}

export const GITHUB_CONFIG = {
  // Configuración de GitHub para modo Remoto
  // Estas variables se leen prioritariamente de .env.local
  owner: process.env.GITHUB_OWNER || 'jfinfotest',
  repo: process.env.GITHUB_REPO || 'prueba_doc',
  branch: process.env.GITHUB_BRANCH || 'main',
  docsPath: process.env.GITHUB_DOCS_PATH || 'docs',
  versions: (() => {
    try {
      const versionsEnv = process.env.NEXT_PUBLIC_GITHUB_VERSIONS;
      if (!versionsEnv) return [];
      
      // Intentar parsear como JSON para configuración avanzada
      if (versionsEnv.trim().startsWith('[') || versionsEnv.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(versionsEnv);
          if (Array.isArray(parsed)) {
            return parsed.map((v: any) => {
              if (typeof v === 'string') return { id: v };
              return v as VersionConfig;
            });
          }
        } catch (e) {
          console.error("Error parsing GITHUB_VERSIONS JSON:", e);
        }
      }
      
      // Fallback a lista separada por comas
      return versionsEnv.split(',').filter(Boolean).map(v => ({ id: v.trim() }));
    } catch {
      return [];
    }
  })() as VersionConfig[],
};
