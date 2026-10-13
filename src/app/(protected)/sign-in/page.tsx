import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { SignInForm } from "./SignInForm";

// A Server Component shell so an already-signed-in visitor hitting this
// URL directly (bookmark, back button, a stale link) gets redirected
// forward instead of being shown the form again — the form itself stays
// client-side below.
export default async function SignInPage() {
  const { data: session } = await auth.getSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <SignInForm />;
}
