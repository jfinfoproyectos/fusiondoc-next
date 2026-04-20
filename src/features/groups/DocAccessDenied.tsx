import Link from "next/link";
import { ShieldAlert, Clock, Lock, LogIn, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocAccessDeniedProps {
  folderId: string;
  authenticated: boolean;
  grantingGroups: { id: string; name: string }[];
  membershipStatus: Record<string, "APPROVED" | "PENDING" | "REJECTED" | null>;
}

export default function DocAccessDenied({
  folderId,
  authenticated,
  grantingGroups,
  membershipStatus,
}: DocAccessDeniedProps) {
  const hasPending = Object.values(membershipStatus).some((s) => s === "PENDING");
  const hasRejected = Object.values(membershipStatus).some((s) => s === "REJECTED");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Ícono */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border-2 border-destructive/20">
            {!authenticated ? (
              <Lock className="w-10 h-10 text-destructive/70" />
            ) : hasPending ? (
              <Clock className="w-10 h-10 text-amber-500/70" />
            ) : (
              <ShieldAlert className="w-10 h-10 text-destructive/70" />
            )}
          </div>
        </div>

        {/* Título y descripción */}
        <div className="space-y-3">
          {!authenticated ? (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Acceso Restringido</h1>
              <p className="text-muted-foreground text-lg">
                La documentación{" "}
                <span className="font-semibold text-foreground">"{folderId}"</span> requiere
                autenticación para ser leída.
              </p>
            </>
          ) : hasPending ? (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Solicitud Pendiente</h1>
              <p className="text-muted-foreground text-lg">
                Tu solicitud de inscripción está siendo revisada. Podrás acceder a{" "}
                <span className="font-semibold text-foreground">"{folderId}"</span> una vez
                que el administrador la apruebe.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Sin Acceso</h1>
              <p className="text-muted-foreground text-lg">
                No tienes permiso para ver la documentación{" "}
                <span className="font-semibold text-foreground">"{folderId}"</span>. Necesitas
                ser miembro de uno de los grupos que dan acceso.
              </p>
            </>
          )}
        </div>

        {/* Grupos que dan acceso */}
        {grantingGroups.length > 0 && (
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-5 space-y-3 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Grupos con acceso a esta documentación
            </p>
            <div className="space-y-2">
              {grantingGroups.map((group) => {
                const status = membershipStatus[group.id];
                return (
                  <div
                    key={group.id}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-background border border-border/40"
                  >
                    <span className="font-semibold text-sm">{group.name}</span>
                    {status === "APPROVED" ? (
                      <Badge className="text-xs bg-emerald-600">Miembro</Badge>
                    ) : status === "PENDING" ? (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Clock className="w-3 h-3" /> Pendiente
                      </Badge>
                    ) : status === "REJECTED" ? (
                      <Badge variant="destructive" className="text-xs">Rechazado</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">No inscrito</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {!authenticated ? (
            <>
              <Link href={`/signin?callbackUrl=${encodeURIComponent("/" + folderId)}`}>
                <Button className="gap-2 rounded-xl h-11 px-6 font-semibold w-full sm:w-auto">
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-semibold w-full sm:w-auto">
                  Crear cuenta
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/groups">
                <Button className="gap-2 rounded-xl h-11 px-6 font-semibold w-full sm:w-auto">
                  <Users className="w-4 h-4" />
                  {hasPending
                    ? "Ver mis solicitudes"
                    : hasRejected
                    ? "Solicitar de nuevo"
                    : "Ver grupos disponibles"}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-semibold w-full sm:w-auto">
                  Volver al inicio
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
