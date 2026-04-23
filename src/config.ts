import { getSettings } from "@/lib/settings";

export async function getSiteConfig() {
  const settings = await getSettings();
  return {
    title: settings.siteTitle,
    logo: settings.siteLogo,
    defaultTheme: settings.defaultTheme,
    defaultCodeTheme: settings.defaultCodeTheme,
    defaultAppearance: settings.defaultAppearance,
    enableAuthDb: true, // Siempre true ahora
    footerText: settings.footerText,
    socialLinks: JSON.parse(settings.socialLinks || "[]"),
    forceDefaultSettings: settings.forceDefaultSettings,
  };
}

export async function getGithubConfig() {
  const settings = await getSettings();
  return {
    owner: settings.githubOwner,
    repo: settings.githubRepo,
    branch: settings.githubBranch,
    docsPath: settings.githubDocsPath,
    token: settings.githubToken,
  };
}

