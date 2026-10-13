// One-off migration: converts work_projects.category (single value) into
// categories (TEXT[]) so one project can belong to multiple categories
// at once (e.g. both "SaaS & Web Apps" and "Automation"). Safe whether
// or not the old `category` column was ever added.
//
// Run with:
//   node scripts/alter-work-category-to-array.mjs
// Reads POSTGRES_URL from .env.local (gitignored, not committed).

process.loadEnvFile(new URL("../.env.local", import.meta.url));

const { sql } = await import("@vercel/postgres");

console.log("Adding categories column (TEXT[], default empty)...");
await sql`
  ALTER TABLE work_projects
    ADD COLUMN IF NOT EXISTS categories TEXT[] NOT NULL DEFAULT '{}';
`;

console.log("Backfilling from the old category column, if it exists...");
await sql`
  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'work_projects' AND column_name = 'category'
    ) THEN
      UPDATE work_projects
        SET categories = ARRAY[category]
        WHERE category IS NOT NULL AND categories = '{}';
      ALTER TABLE work_projects DROP COLUMN category;
    END IF;
  END $$;
`;

console.log("Done. Each project can now have multiple categories, editable from /cms/work.");
process.exit(0);
