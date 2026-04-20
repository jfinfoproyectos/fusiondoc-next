import SignUp from "@/features/auth/SignUp";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Crear Cuenta" };

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    }>
      <SignUp />
    </Suspense>
  );
}
