import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "../../../features/admin/SettingsForm";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Settings } from "lucide-react";

import { getAvailableThemes } from "@/app/actions/themes";

export const metadata = {
  title: "Configuración | FusionDoc",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    redirect("/dashboard/groups");
  }

  const settings = await getSettings();
  const themes = await getAvailableThemes();

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Configuración</h1>
        </div>
        <p className="text-muted-foreground font-medium">
          Gestiona los parámetros globales del sistema, conexión con GitHub y apariencia visual.
        </p>
      </div>

      <SettingsForm initialSettings={settings} themes={themes} />
    </div>
  );
}
