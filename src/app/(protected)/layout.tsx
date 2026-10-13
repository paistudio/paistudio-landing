import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/server";
import { signOut } from "@/lib/actions/auth-actions";
import { NavigationProgress } from "@/components/cms/NavigationProgress";

export const metadata: Metadata = {
  robots: { index: false },
};

// Server Components that call auth.getSession() must render dynamically —
// otherwise Next could cache a signed-in header for a signed-out visitor.
export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // getSession()'s 5-minute session-data cache cookie can go stale between
  // middleware's proactive refresh (which only updates the response's
  // Set-Cookie header, taking effect on the *next* request) and this Server
  // Component's render within the *same* request. When that happens,
  // getSession() falls back to a slow path that tries to write a fresh
  // cookie here — which Next.js disallows outside Server Actions/Route
  // Handlers, throwing instead of returning data. Render as signed-out for
  // that one request rather than hard-crashing the page; the cookie is
  // fresh again by the very next navigation.
  let session: Awaited<ReturnType<typeof auth.getSession>>["data"] = null;
  try {
    ({ data: session } = await auth.getSession());
  } catch (error) {
    console.error("ProtectedLayout: auth.getSession() failed", error);
  }

  return (
    <div className="min-h-screen bg-paper text-text">
      {session?.user && (
        <div className="sticky top-0 z-50">
          <header className="flex items-center justify-between border-b border-ink/10 bg-paper px-6 py-4">
            <nav className="flex items-center gap-6 text-sm font-medium">
              <span className="font-semibold text-ink">Paistudio Internal</span>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/cms">Blog CMS</Link>
              <Link href="/cms/work">Work CMS</Link>
              <Link href="/internal">Internal</Link>
            </nav>
            <form action={signOut} className="flex items-center gap-3">
              <span className="text-sm text-muted">{session.user.name}</span>
              <button type="submit" className="text-sm text-muted hover:text-text">
                Sign out
              </button>
            </form>
          </header>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
        </div>
      )}
      <main className="p-6">{children}</main>
    </div>
  );
}
