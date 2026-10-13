import type { Project } from "@/types/work";
import { rowToProject, sql, type WorkProjectRow } from "./work-db";

/** All list-card projects, in display order (was the static `WORK_PROJECTS`
 * array's declaration order — now the real `sort_order` column, see
 * scripts/setup-work-db.mjs). Excludes projects hidden via the CMS's
 * show/hide toggle — the CMS's own list (cms-work-projects.ts) still
 * reads every row regardless, so hidden projects stay editable. */
export async function getWorkProjects(): Promise<Project[]> {
  const { rows } = await sql<WorkProjectRow>`
    SELECT * FROM work_projects WHERE is_visible = true ORDER BY sort_order
  `;
  return rows.map(rowToProject);
}
