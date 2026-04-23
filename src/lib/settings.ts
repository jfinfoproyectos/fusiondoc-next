import prisma from "@/lib/prisma";

export async function getSettings() {
  try {
    let settings = await prisma.systemSetting.findFirst();

    if (!settings) {
      // Si no existen configuraciones, se crea el singleton con los valores por defecto del esquema
      settings = await prisma.systemSetting.create({
        data: {}
      });
    }

    const mergedSettings = {
      ...settings,
      githubToken: settings.githubToken || process.env.GITHUB_TOKEN || null,
      githubOwner: settings.githubOwner || process.env.GITHUB_OWNER || "jfinfotest",
      githubRepo: settings.githubRepo || process.env.GITHUB_REPO || "prueba_doc",
      githubBranch: settings.githubBranch || process.env.GITHUB_BRANCH || "main",
      githubDocsPath: settings.githubDocsPath || process.env.GITHUB_DOCS_PATH || "docs",
      siteTitle: settings.siteTitle || process.env.SITE_TITLE || "FusionDoc",
      siteLogo: settings.siteLogo || process.env.SITE_LOGO || "lucide:package",
      footerText: settings.footerText || process.env.FOOTER_TEXT || "© 2026 FusionDoc",
      socialLinks: settings.socialLinks || process.env.SOCIAL_LINKS || "[]",
      defaultTheme: settings.defaultTheme || process.env.DEFAULT_THEME || "cyberpunk",
      defaultAppearance: settings.defaultAppearance || process.env.DEFAULT_APPEARANCE || "dark",
      defaultCodeTheme: settings.defaultCodeTheme || process.env.DEFAULT_CODE_THEME || "one-dark-pro",
    };

    return mergedSettings;
  } catch (error) {
    console.warn("⚠️ Table system_setting does not exist yet or DB is unreachable. Using default fallback settings.");
    // Return a default object matching the schema so the app doesn't crash
    return {
      id: 1,
      githubToken: process.env.GITHUB_TOKEN || null,
      githubOwner: process.env.GITHUB_OWNER || "jfinfotest",
      githubRepo: process.env.GITHUB_REPO || "prueba_doc",
      githubBranch: process.env.GITHUB_BRANCH || "main",
      githubDocsPath: process.env.GITHUB_DOCS_PATH || "docs",
      siteTitle: process.env.SITE_TITLE || "FusionDoc",
      siteLogo: process.env.SITE_LOGO || "lucide:package",
      footerText: process.env.FOOTER_TEXT || "© 2026 FusionDoc",
      socialLinks: process.env.SOCIAL_LINKS || "[]",
      defaultTheme: process.env.DEFAULT_THEME || "cyberpunk",
      defaultAppearance: process.env.DEFAULT_APPEARANCE || "dark",
      defaultCodeTheme: process.env.DEFAULT_CODE_THEME || "one-dark-pro",
      forceDefaultSettings: process.env.FORCE_DEFAULT_SETTINGS === "true" || false,
      updatedAt: new Date(),
    };
  }
}
