"use client";

import { PROJECTS } from "@/lib/data/projects";
import { useScrollDriver } from "@/lib/scroll/useScrollDriver";

export function ProgressRail() {
  const { activeProject, goto } = useScrollDriver();
  const visible = activeProject >= 0 && activeProject < PROJECTS.length;

  return (
    <div
      className="fixed top-1/2 right-[30px] z-40 flex -translate-y-1/2 flex-col items-end gap-3.5 transition-opacity duration-[400ms]"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
    >
      {PROJECTS.map((project, i) => {
        const on = i === activeProject;
        return (
          <button
            key={project.id}
            type="button"
            aria-label={`Go to ${project.name}`}
            aria-current={on}
            onClick={() => goto(i)}
            className="flex cursor-pointer items-center gap-2.5 p-1"
          >
            <span
              className="block rounded-full transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: on ? 22 : 7,
                height: 7,
                background: on ? "#ffffff" : "rgba(255,255,255,0.32)",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
