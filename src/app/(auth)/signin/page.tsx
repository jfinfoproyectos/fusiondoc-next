import SignIn from "@/features/auth/SignIn";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Iniciar Sesión" };

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    }>
      <SignIn />
    </Suspense>
  );
}
