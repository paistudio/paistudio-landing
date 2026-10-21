import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { ResetPasswordForm } from "./ResetPasswordForm";

// Same rationale as /sign-in's own page.tsx. `ResetPasswordForm` reads the
// `?token=` query param via `useSearchParams()`, which requires a
// Suspense boundary in a Client Component.
export default async function ResetPasswordPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
