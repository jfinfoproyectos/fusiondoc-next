"use client";

import { useEffect, useState } from "react";
import { ThemeSelector } from "./ThemeSelector";
import { CodeThemeSelector } from "./CodeThemeSelector";
import { ModeToggle } from "./mode-toggle";
import MobileConfig from "./MobileConfig";

interface ConfigControlsProps {
  availableThemes: any[];
  currentCodeTheme: string;
  siteConfig: any;
}

export function ConfigControls({ 
  availableThemes, 
  currentCodeTheme, 
  siteConfig 
}: ConfigControlsProps) {
  const [isForced, setIsForced] = useState(siteConfig.forceDefaultSettings);

  useEffect(() => {
    const handleForcePreview = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsForced(detail);
    };

    window.addEventListener("fusiondoc-force-preview", handleForcePreview);
    return () => window.removeEventListener("fusiondoc-force-preview", handleForcePreview);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="mobile-only items-center">
        <MobileConfig 
          themes={availableThemes} 
          currentCodeTheme={currentCodeTheme} 
          siteConfig={{ ...siteConfig, forceDefaultSettings: isForced }} 
        />
      </div>
      
      <div className="desktop-only items-center gap-1.5 flex">
        {!isForced && (
          <>
            <ThemeSelector 
              themes={availableThemes} 
              defaultTheme={siteConfig.defaultTheme} 
              forceDefaultSettings={siteConfig.forceDefaultSettings} 
            />
            <CodeThemeSelector currentTheme={currentCodeTheme} />
            <ModeToggle />
          </>
        )}
      </div>
    </div>
  );
}
