"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SITE_CONFIG } from "@/config";

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
  // If a default is forced in .env, use it strictly
  if (SITE_CONFIG.defaultCodeTheme) {
    return SITE_CONFIG.defaultCodeTheme;
  }

  const cookieStore = await cookies();
  const themeFromCookie = cookieStore.get("code-theme")?.value;
  
  if (themeFromCookie) {
    return themeFromCookie;
  }
  
  return "github-dark";
}
