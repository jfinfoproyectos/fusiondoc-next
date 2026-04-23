"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSiteConfig } from "@/config";

export async function setCodeTheme(themeId: string) {
  const cookieStore = await cookies();
  cookieStore.set("code-theme", themeId, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
  
  // We don't call heavy revalidatePath("/", "layout") here anymore
  // because we're using router.refresh() on the client for instant updates.
}

export async function getCodeTheme() {
  const siteConfig = await getSiteConfig();
  const cookieStore = await cookies();
  const themeFromCookie = cookieStore.get("code-theme")?.value;

  if (siteConfig.forceDefaultSettings && siteConfig.defaultCodeTheme) {
    return siteConfig.defaultCodeTheme;
  }

  if (themeFromCookie) {
    return themeFromCookie;
  }

  return siteConfig.defaultCodeTheme || "github-dark";
}
