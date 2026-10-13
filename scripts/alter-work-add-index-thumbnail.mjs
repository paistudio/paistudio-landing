// One-off migration: adds a nullable `index_thumbnail` column to
// work_projects for the CMS's new "Index thumbnail" image field.
//
// Run with:
//   node scripts/alter-work-add-index-thumbnail.mjs
// Reads POSTGRES_URL from .env.local (gitignored, not committed).

process.loadEnvFile(new URL("../.env.local", import.meta.url));

const { sql } = await import("@vercel/postgres");

console.log("Adding index_thumbnail column to work_projects (nullable)...");
await sql`
  ALTER TABLE work_projects
    ADD COLUMN IF NOT EXISTS index_thumbnail TEXT;
`;

console.log("Done.");
process.exit(0);
