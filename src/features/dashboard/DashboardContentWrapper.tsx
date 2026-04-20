"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardContentWrapperProps {
  children: React.ReactNode;
}

export function DashboardContentWrapper({ children }: DashboardContentWrapperProps) {
  const pathname = usePathname();
  
  // Detect if we are in the doc editor
  const isDocEditor = pathname.includes("/dashboard/admin/docs/") && pathname.split("/").length >= 5;

  return (
    <main className={cn(
      "flex-1 w-full transition-all duration-300",
      isDocEditor 
        ? "max-w-none px-0 py-0 overflow-hidden h-full" 
        : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    )}>
      {children}
    </main>
  );
}
