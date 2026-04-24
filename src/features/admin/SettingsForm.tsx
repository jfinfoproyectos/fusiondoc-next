"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateSettingsAction } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { SHIKI_THEMES } from "@/components/CodeThemeSelector";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { 
  Globe, 
  Palette, 
  Save, 
  Loader2,
  ExternalLink
} from "lucide-react";
import DynamicIcon from "@/components/DynamicIcon";

interface SettingsFormProps {
  initialSettings: any;
  themes: any[];
}

export function SettingsForm({ initialSettings, themes }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    githubToken: initialSettings.githubToken || "",
    githubOwner: initialSettings.githubOwner || "",
    githubRepo: initialSettings.githubRepo || "",
    githubBranch: initialSettings.githubBranch || "",
    githubDocsPath: initialSettings.githubDocsPath || "",
    siteTitle: initialSettings.siteTitle || "",
    siteLogo: initialSettings.siteLogo || "",
    footerText: initialSettings.footerText || "",
    socialLinks: initialSettings.socialLinks || "[]",
    defaultTheme: initialSettings.defaultTheme || "",
    defaultAppearance: initialSettings.defaultAppearance || "",
    defaultCodeTheme: initialSettings.defaultCodeTheme || "",
    forceDefaultSettings: initialSettings.forceDefaultSettings || false,
  });

  const { setTheme } = useTheme();

  // LIVE PREVIEW EFFECT - Removed setTheme to prevent unwanted theme switching
  // The theme will now only change upon saving or via the header toggle.
  useEffect(() => {
    // Force hide/show buttons live preview (this only affects UI visibility, not theme)
    window.dispatchEvent(new CustomEvent("fusiondoc-force-preview", { detail: formData.forceDefaultSettings }));
  }, [formData.forceDefaultSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [activeTab, setActiveTab] = useState("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateSettingsAction(formData);
      if (result.success) {
        toast.success("Configuración actualizada correctamente");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar la configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8 h-12 p-1 bg-muted/50 rounded-2xl border border-border/50">
          <TabsTrigger value="general" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="github" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <DynamicIcon icon="lucide:github" width="16" height="16" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl gap-2 font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Palette className="w-4 h-4" />
            Apariencia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
              <CardTitle className="text-2xl font-black italic uppercase">Identidad del Sitio</CardTitle>
              <CardDescription className="text-base font-medium">Configura el título, logo y textos globales de la aplicación.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="siteTitle" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Título del Sitio</Label>
                  <Input
                    id="siteTitle"
                    name="siteTitle"
                    value={formData.siteTitle}
                    onChange={handleChange}
                    placeholder="Ej: FusionDoc"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="siteLogo" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Logo (Icono)</Label>
                  <Input
                    id="siteLogo"
                    name="siteLogo"
                    value={formData.siteLogo}
                    onChange={handleChange}
                    placeholder="Ej: lucide:package"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="footerText" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Texto del Pie de Página</Label>
                <Input
                  id="footerText"
                  name="footerText"
                  value={formData.footerText}
                  onChange={handleChange}
                  placeholder="Ej: © 2026 FusionDoc"
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="socialLinks" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Enlaces Sociales (JSON)</Label>
                <Textarea
                  id="socialLinks"
                  name="socialLinks"
                  value={formData.socialLinks}
                  onChange={handleChange}
                  placeholder='[{"name":"GitHub","url":"...","icon":"..."}]'
                  className="min-h-[120px] rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="github" className="space-y-6">
          <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black italic uppercase">Conexión GitHub</CardTitle>
                  <CardDescription className="text-base font-medium">Define el repositorio donde se encuentra tu documentación técnica.</CardDescription>
                </div>
                <div className="hidden sm:block">
                  <Button variant="outline" size="sm" asChild className="rounded-xl gap-2 font-bold">
                    <a href={`https://github.com/${formData.githubOwner}/${formData.githubRepo}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Ver Repo
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="githubOwner" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Usuario / Organización</Label>
                  <Input
                    id="githubOwner"
                    name="githubOwner"
                    value={formData.githubOwner}
                    onChange={handleChange}
                    placeholder="Ej: jfinfotest"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="githubRepo" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Repositorio</Label>
                  <Input
                    id="githubRepo"
                    name="githubRepo"
                    value={formData.githubRepo}
                    onChange={handleChange}
                    placeholder="Ej: fuciondoct1"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                  />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="githubBranch" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Rama (Branch)</Label>
                  <Input
                    id="githubBranch"
                    name="githubBranch"
                    value={formData.githubBranch}
                    onChange={handleChange}
                    placeholder="Ej: main"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="githubDocsPath" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Carpeta de Documentación</Label>
                  <Input
                    id="githubDocsPath"
                    name="githubDocsPath"
                    value={formData.githubDocsPath}
                    onChange={handleChange}
                    placeholder="Ej: docs"
                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="githubToken" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">GitHub Personal Access Token (PAT)</Label>
                <Input
                  id="githubToken"
                  name="githubToken"
                  type="password"
                  value={formData.githubToken}
                  onChange={handleChange}
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                />
                <p className="text-[10px] text-muted-foreground px-1">
                  Recomendado para evitar límites de rate-limiting de la API de GitHub.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-border/50 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/30 pb-8 pt-10 px-10">
              <CardTitle className="text-2xl font-black italic uppercase">Preferencia de Estilo</CardTitle>
              <CardDescription className="text-base font-medium">Establece los valores predeterminados para el tema y resaltado de código.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className={cn("grid gap-6 sm:grid-cols-2 transition-all duration-300", !formData.forceDefaultSettings && "opacity-40 grayscale pointer-events-none")}>
                <div className="space-y-3">
                  <Label htmlFor="defaultTheme" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Tema por Defecto</Label>
                  <Select 
                    value={formData.defaultTheme} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, defaultTheme: val }))}
                    disabled={!formData.forceDefaultSettings}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all">
                      <SelectValue placeholder="Selecciona un tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Predeterminado</SelectItem>
                      {themes.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="defaultAppearance" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Apariencia</Label>
                  <Select 
                    value={formData.defaultAppearance} 
                    onValueChange={(val) => setFormData(prev => ({ ...prev, defaultAppearance: val }))}
                    disabled={!formData.forceDefaultSettings}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all">
                      <SelectValue placeholder="Selecciona apariencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Sistema</SelectItem>
                      <SelectItem value="dark">Oscuro (Dark)</SelectItem>
                      <SelectItem value="light">Claro (Light)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className={cn("space-y-3 transition-all duration-300", !formData.forceDefaultSettings && "opacity-40 grayscale pointer-events-none")}>
                <Label htmlFor="defaultCodeTheme" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Tema de Código (Shiki)</Label>
                <Select 
                  value={formData.defaultCodeTheme} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, defaultCodeTheme: val }))}
                  disabled={!formData.forceDefaultSettings}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all">
                    <SelectValue placeholder="Selecciona tema de código" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {SHIKI_THEMES.map(st => (
                      <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="space-y-0.5">
                    <Label htmlFor="forceDefaultSettings" className="text-base font-bold">Forzar valores por defecto</Label>
                    <p className="text-xs text-muted-foreground font-medium">
                      Si se activa, los usuarios no verán los botones de personalización en el header.
                    </p>
                  </div>
                  <Switch
                    id="forceDefaultSettings"
                    checked={formData.forceDefaultSettings}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, forceDefaultSettings: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={loading || (activeTab === "appearance" && !formData.forceDefaultSettings && formData.forceDefaultSettings === initialSettings.forceDefaultSettings)}
            className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar Cambios
          </Button>
        </div>
      </Tabs>
    </form>
  );
}
