// Standalone, DB-free — safe to import from a client component. Living
// in blog-posts.ts (which imports `sql` from blog-db.ts at module scope)
// would drag that chain's env-var-reading Postgres client initialization
// into the browser bundle the moment anything from that file is imported
// by a "use client" component, crashing with a missing POSTGRES_URL error.
//
// The category taxonomy itself isn't "content" in the sense the Postgres
// migration was for (blog posts), it's fixed UI structure the filter tabs
// render. Posts themselves live in the blog_posts table (see blog-db.ts /
// scripts/setup-blog-db.mjs). "Guides", "Business", "Bubble Development",
// and "Development" added for migrated posts (see scripts/migrate-*.mjs)
// — the real categories each source page itself uses, not from the 5
// categories this taxonomy originally shipped with.
export const BLOG_CATEGORIES = [
  "All",
  "Product Strategy",
  "No-Code & AI",
  "Case Studies",
  "Founder Stories",
  "Guides",
  "Business",
  "Bubble Development",
  "Development",
];
