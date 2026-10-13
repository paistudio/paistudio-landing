import Link from "next/link";
import { BriefcaseIcon } from "@phosphor-icons/react/dist/ssr";
import { getAllWorkProjectsForCms } from "@/lib/data/cms-work-projects";
import { WorkProjectsDataTable } from "@/components/cms/WorkProjectsDataTable";

export const revalidate = 0;

export default async function CmsWorkPage() {
  const projects = await getAllWorkProjectsForCms();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Work CMS</h1>
        <p className="mt-1 text-sm text-muted">
          {projects.length === 0 ? "No projects yet" : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-16 text-center">
          <BriefcaseIcon size={32} weight="thin" className="text-muted" />
          <p className="text-sm text-muted">No projects yet — create the first one.</p>
          <Link
            href="/cms/work/new"
            className="mt-1 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/90"
          >
            New Project
          </Link>
        </div>
      ) : (
        <WorkProjectsDataTable projects={projects} />
      )}
    </div>
  );
}
