"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ProjectForm } from "./ProjectForm";
import type { WorkProjectRow } from "@/lib/data/work-db";

type WorkProjectDrawerProps = {
  /** `null` while closed — see `lastProject` below for why this isn't
   * read directly once closing starts. */
  project: WorkProjectRow | null;
  onClose: () => void;
};

/** A Notion-style side panel for editing a Work project in place, instead
 * of navigating to /cms/work/[slug]/edit — on request ("bisa gak buka
 * side drawer aja kaya notion?"). Same open/close mechanics as
 * `MobileNav.tsx` (always mounted, `transform`/`opacity` transitions
 * driven by a boolean, Escape + body-scroll-lock, backdrop click to
 * close) rather than a new Dialog/Sheet dependency — this project already
 * has a proven hand-rolled pattern for exactly this shape of overlay.
 *
 * Reuses `ProjectForm` completely unmodified: its own Server Action still
 * redirects to `/cms/work` on save, which — since we're already on that
 * route — just refreshes the page's Server Component data rather than
 * navigating away. `WorkProjectsDataTable` watches for that refresh (its
 * `initialProjects` prop changing identity) and closes the drawer then,
 * so a save closes the panel automatically without `ProjectForm` needing
 * to know it's inside one. */
export function WorkProjectDrawer({ project, onClose }: WorkProjectDrawerProps) {
  const open = project !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  // Remembers the last non-null project so the panel keeps showing its
  // content through the close transition instead of going blank the
  // instant `project` flips to `null`. Updated synchronously during
  // render ("adjusting state when a prop changes", per React's own docs)
  // rather than in an effect or a ref read during render — both of those
  // are flagged by this project's stricter hook lint rules.
  const [prevProject, setPrevProject] = useState(project);
  const [lastProject, setLastProject] = useState(project);
  if (project !== prevProject) {
    setPrevProject(project);
    if (project) setLastProject(project);
  }

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("input,textarea,button")?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: open ? "auto" : "none" }} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={lastProject ? `Edit ${lastProject.title}` : "Edit project"}
        className="absolute top-0 right-0 flex h-full w-[92vw] max-w-4xl flex-col border-l border-ink/10 bg-paper shadow-[-18px_0_48px_rgba(0,0,0,0.12)] transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="text-base font-semibold text-ink">{lastProject ? lastProject.title : "Edit project"}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-text"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{lastProject && <ProjectForm initialProject={lastProject} />}</div>
      </div>
    </div>
  );
}
