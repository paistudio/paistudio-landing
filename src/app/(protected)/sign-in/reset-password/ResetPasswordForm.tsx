"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword, type ResetPasswordState } from "../actions";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, formAction, isPending] = useActionState<ResetPasswordState, FormData>(resetPassword, {
    error: null,
    success: false,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-ink/10 bg-paper p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(3,105,161,0.06)]">
        <h1 className="text-xl font-bold text-ink">Set a new password</h1>

        {state.success ? (
          <>
            <p className="rounded bg-success/15 px-3 py-2 text-sm text-success">
              Password updated. You can sign in with it now.
            </p>
            <a
              href="/sign-in"
              className="mt-2 rounded-lg bg-ink px-4 py-2 text-center text-sm font-medium text-paper"
            >
              Go to sign in
            </a>
          </>
        ) : !token ? (
          <>
            <p className="rounded bg-cream px-3 py-2 text-sm text-text">
              This link is missing or invalid. Request a new one from the sign-in page.
            </p>
            <a href="/sign-in/forgot-password" className="text-center text-sm text-muted hover:text-text">
              ← Back to forgot password
            </a>
          </>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="token" value={token} />

            {state.error && <p className="rounded bg-cream px-3 py-2 text-sm text-text">{state.error}</p>}

            <label className="flex flex-col gap-1 text-sm">
              New password
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="rounded border border-ink/10 px-2 py-1"
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
            >
              {isPending ? "Saving…" : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
