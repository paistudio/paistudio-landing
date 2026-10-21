import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

// Same rationale as /sign-in's own page.tsx: redirect an already-signed-in
// visitor forward instead of showing them a password-reset form.
export default async function ForgotPasswordPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;
}
