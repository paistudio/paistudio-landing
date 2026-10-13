// One-off migration: adds a `category` column to work_projects for the
// CMS's new Category dropdown (SaaS & Web Apps / Marketplace / AI
// Products / Automation / Internal Tools / MVP). Nullable — existing
// rows have no category assigned yet, same pattern as the pre-existing
// `badge` column (optional, filled in per-row by a human in the CMS).
// A CHECK constraint keeps the column restricted to the 6 known values
// (NULL still passes, so existing unassigned rows are unaffected).
//
// Run with:
//   node scripts/alter-work-add-category.mjs
// Reads POSTGRES_URL from .env.local (gitignored, not committed).

process.loadEnvFile(new URL("../.env.local", import.meta.url));

const { sql } = await import("@vercel/postgres");

console.log("Adding category column to work_projects (nullable, with a CHECK constraint)...");
await sql`
  ALTER TABLE work_projects
    ADD COLUMN IF NOT EXISTS category TEXT
      CHECK (category IN ('SaaS & Web Apps', 'Marketplace', 'AI Products', 'Automation', 'Internal Tools', 'MVP'));
`;

console.log("Done. Assign a category to each existing project from /cms/work.");
process.exit(0);
