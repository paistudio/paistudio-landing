// Standalone, DB-free — safe to import from a client component. Living
// in blog-db.ts (which also exports `sql` from @vercel/postgres) would
// drag that module's env-var-reading client initialization into the
// browser bundle the moment anything from that file is imported by a
// "use client" component, crashing with a missing POSTGRES_URL error.

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** `published_at` (a real DATE column) → the same "Jul 28, 2026" display
 * string the old static data hardcoded — formatted here instead of stored,
 * so there's one source of truth instead of a date + a hand-written label
 * that could drift apart. */
export function formatPublishedDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}
