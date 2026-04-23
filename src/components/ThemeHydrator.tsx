"use client";

import { useEffect, useState } from "react";
import { ThemeInfo } from "@/app/actions/themes";

interface ThemeHydratorProps {
  themes: ThemeInfo[];
  defaultTheme?: string | null;
  forceDefaultSettings?: boolean;
}

export function ThemeHydrator({ themes, defaultTheme, forceDefaultSettings }: ThemeHydratorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Listen for custom change events from ThemeSelector to update immediately
    const handleThemeChange = (e?: Event) => {
      const detail = (e as CustomEvent)?.detail;
      const savedTheme = detail || localStorage.getItem("fusiondoc-theme") || "default";

      // If a default is forced and NO specific event detail is provided, use the forced default
      if (forceDefaultSettings && defaultTheme && !detail) {
        applyTheme(defaultTheme);
        return;
      }

      applyTheme(savedTheme);
    };

    window.addEventListener("fusiondoc-theme-change", handleThemeChange);
    
    // Initial application
    handleThemeChange();

    return () => window.removeEventListener("fusiondoc-theme-change", handleThemeChange);
  }, [mounted, defaultTheme, themes]);

  const applyTheme = (themeId: string) => {
    const elId = "fusiondoc-dynamic-theme";
    let styleEl = document.getElementById(elId);

    if (themeId === "default") {
      if (styleEl) styleEl.remove();
      return;
    }

    const themeData = themes.find((t) => t.id === themeId);
    if (!themeData) return;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = elId;
      document.head.appendChild(styleEl);
    }

    // Process CSS - CLEANING TAILWIND V4 SYNTAX
    let processedCss = themeData.cssContent;
    
    // 1. Remove Tailwind imports and custom directives that browsers don't understand
    processedCss = processedCss.replace(/@import\s+["'][^"']+["'];/g, '');
    processedCss = processedCss.replace(/@custom-variant\s+[^;]+;/g, '');
    processedCss = processedCss.replace(/@variant\s+[^;]+;/g, '');
    
    // 2. Original cleanup
    processedCss = processedCss.replace(/@theme\s+inline\s*{[\s\S]*?}/g, '');
    processedCss = processedCss.replace(/@layer\s+base\s*{[\s\S]*?}/g, '');
    processedCss = processedCss.replace(/@apply\s+[^;]+;/g, '');

    styleEl.innerHTML = processedCss;
    handleFontLoading(processedCss);
  };

  const handleFontLoading = (css: string) => {
    const fontVars = ['--font-sans', '--font-serif', '--font-mono'];
    const foundFonts = new Set<string>();

    fontVars.forEach(v => {
      const reg = new RegExp(`${v}:\\s*([^;]+);`);
      const match = css.match(reg);
      if (match && match[1]) {
        const firstFont = match[1].split(',')[0].trim().replace(/['"]/g, '');
        if (firstFont && !isSystemFont(firstFont)) {
          foundFonts.add(firstFont);
        }
      }
    });

    if (foundFonts.size > 0) {
      const fontQuery = Array.from(foundFonts)
        .map(f => `family=${f.replace(/\s+/g, '+')}:wght@400;500;700`)
        .join('&');

      const linkId = "fusiondoc-dynamic-fonts";
      let linkEl = document.getElementById(linkId) as HTMLLinkElement;

      if (!linkEl) {
        linkEl = document.createElement("link");
        linkEl.id = linkId;
        linkEl.rel = "stylesheet";
        document.head.appendChild(linkEl);
      }

      linkEl.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    }
  };

  const isSystemFont = (font: string) => {
    const systemFonts = ['inter', 'roboto', 'geist', 'sans-serif', 'serif', 'monospace', 'ui-sans-serif', 'system-ui', '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'helvetica neue', 'arial', 'noto sans', 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji', 'georgia', 'cambria', 'times new roman', 'times', 'ui-serif', 'ui-monospace', 'sfmono-regular', 'menlo', 'monaco', 'consolas', 'liberation mono', 'courier new'];
    return systemFonts.includes(font.toLowerCase());
  };

  return null;
}
