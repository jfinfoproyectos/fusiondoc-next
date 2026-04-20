// Removed SidebarTrigger as it was part of the cleaned-up components
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Toaster />
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
