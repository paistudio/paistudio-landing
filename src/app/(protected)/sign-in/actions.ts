"use server";

import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type SignInState = { error: string | null };

export async function signInWithEmail(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await auth.signIn.email({ email, password });

  if (error) {
    return { error: error.message || "Failed to sign in. Check your email and password." };
  }

  redirect("/dashboard");
}

/** No env var for the app's own origin exists anywhere in this project, so
 * this reads it from the incoming request instead of adding one — works
 * identically in dev and prod with zero config. */
async function getAppOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export type RequestResetState = { error: string | null; sent: boolean };

/** Always reports success regardless of whether the email actually
 * exists — the same enumeration-safe behavior most auth providers use
 * (never reveal via this form whether a given email has an account). */
export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Email is required.", sent: false };
  }

  const origin = await getAppOrigin();
  const { error } = await auth.requestPasswordReset({
    email,
    redirectTo: `${origin}/sign-in/reset-password`,
  });

  // A genuine delivery/config failure (e.g. no email provider set up on
  // the Neon Auth project) still surfaces here — only the "email doesn't
  // exist" case is deliberately hidden by always returning `sent: true`
  // below when there's no hard error.
  if (error) {
    return { error: error.message || "Something went wrong sending the reset email.", sent: false };
  }

  return { error: null, sent: true };
}

export type ResetPasswordState = { error: string | null; success: boolean };

export async function resetPassword(_prevState: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const newPassword = String(formData.get("newPassword") ?? "");
  const token = String(formData.get("token") ?? "");

  if (!token) {
    return { error: "Missing or expired reset link. Request a new one.", success: false };
  }
  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  const { error } = await auth.resetPassword({ newPassword, token });

  if (error) {
    return { error: error.message || "Failed to reset password. The link may have expired.", success: false };
  }

  return { error: null, success: true };
}
