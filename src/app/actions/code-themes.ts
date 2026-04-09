"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setCodeTheme(themeId: string) {
  const cookieStore = await cookies();
  cookieStore.set("code-theme", themeId, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });
  
  // Revalidate the entire documentation to reflect the new theme in Server Components
  revalidatePath("/", "layout");
}

export async function getCodeTheme() {
  const cookieStore = await cookies();
  return cookieStore.get("code-theme")?.value || "github-dark";
}
