"use client";

import { useActionState } from "react";
import { requestPasswordReset, type RequestResetState } from "../actions";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<RequestResetState, FormData>(requestPasswordReset, {
    error: null,
    sent: false,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-ink/10 bg-paper p-8 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(3,105,161,0.06)]">
        <h1 className="text-xl font-bold text-ink">Reset your password</h1>

        {state.sent ? (
          <p className="rounded bg-success/15 px-3 py-2 text-sm text-success">
            If an account exists for that email, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <p className="text-sm text-muted">Enter your email and we&apos;ll send you a link to reset it.</p>

            {state.error && <p className="rounded bg-cream px-3 py-2 text-sm text-text">{state.error}</p>}

            <label className="flex flex-col gap-1 text-sm">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="rounded border border-ink/10 px-2 py-1"
              />
            </label>

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-60"
            >
              {isPending ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <a href="/sign-in" className="text-center text-sm text-muted hover:text-text">
          ← Back to sign in
        </a>
      </div>
    </div>
  );
}
