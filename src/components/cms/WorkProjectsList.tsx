"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseIcon, CheckCircleIcon, CircleIcon, PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { PROJECT_CATEGORIES } from "@/types/work";
import type { WorkProjectRow } from "@/lib/data/work-db";
import { DeleteProjectButton } from "./DeleteProjectButton";

const fieldClass =
  "w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-text transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function WorkProjectsList({ projects }: { projects: WorkProjectRow[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch = !query || project.title.toLowerCase().includes(query);
      const matchesCategory = !category || project.categories.includes(category);
      return matchesSearch && matchesCategory;
    });
  }, [projects, search, category]);

  if (projects.length === 0) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${fieldClass} sm:max-w-xs`}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${fieldClass} sm:max-w-48`}>
          <option value="">All categories</option>
          {PROJECT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/15 py-10 text-center text-sm text-muted">
          No projects match these filters.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((project) => (
            <li
              key={project.slug}
              className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-paper p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_16px_rgba(3,105,161,0.06)] transition hover:shadow-[0_2px_6px_rgba(0,0,0,0.1),0_8px_24px_rgba(3,105,161,0.08)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                {project.is_visible ? (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                    <CheckCircleIcon size={14} weight="fill" />
                    Visible
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-muted">
                    <CircleIcon size={14} />
                    Hidden
                  </span>
                )}
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {project.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element -- list thumbnail, same arbitrary-path pattern as the CMS form's previews
                    <img src={project.cover_image} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">{project.title}</p>
                  <p className="text-sm text-muted">
                    {project.categories.length ? `${project.categories.join(", ")} · ` : ""}
                    {project.badge ? `${project.badge} · ` : ""}
                    {project.tags.join(", ")} · #{project.sort_order}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                <Link
                  href={`/cms/work/${project.slug}/edit`}
                  aria-label={`Edit ${project.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
                >
                  <PencilSimpleIcon size={16} />
                </Link>
                <DeleteProjectButton slug={project.slug} title={project.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
