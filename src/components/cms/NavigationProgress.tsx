"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

// App Router removed the old Pages Router's `router.events` — there's no
// native "navigation started"/"navigation finished" signal to hook into.
// This approximates one: a document-level click listener on internal
// links marks "loading" (the closest thing to a start event), and the
// pathname/search-params actually changing — which also fires after a
// Server Action's redirect(), not just a Link click — marks "done".
//
// Two things fast local navigation breaks if not accounted for:
// 1. A single long CSS transition toward e.g. 85% looked broken — a fast
//    page load interrupted it before it had moved, reading as "nothing,
//    then a sudden snap". Fixed by jumping to a small width almost
//    instantly, *then* creeping slower — something is visible right away
//    regardless of how long the load takes.
// 2. Prefetched Next.js routes can finish so fast that React batches the
//    "loading" and "complete" state updates into the same paint — the
//    loading state never actually renders a frame for the CSS transition
//    to animate *from*, so it still looks like an instant jump. Fixed by
//    enforcing a minimum visible duration: "complete" is delayed (if
//    needed) until at least `MIN_VISIBLE_MS` after "loading" started.
const START_WIDTH = "15%";
const CREEP_WIDTH = "85%";
const START_TO_CREEP_DELAY_MS = 100;
const MIN_VISIBLE_MS = 400;
const MAX_LOADING_MS = 6000;

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<"idle" | "loading-start" | "loading-creep" | "complete">("idle");
  const creepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadStartedAtRef = useRef(0);

  const key = `${pathname}?${searchParams.toString()}`;
  const previousKeyRef = useRef(key);

  function clearAllTimers() {
    if (creepTimerRef.current) clearTimeout(creepTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname + url.search === key) return;

      clearAllTimers();
      loadStartedAtRef.current = Date.now();
      setPhase("loading-start");
      creepTimerRef.current = setTimeout(() => setPhase("loading-creep"), START_TO_CREEP_DELAY_MS);
      maxTimerRef.current = setTimeout(() => setPhase("idle"), MAX_LOADING_MS);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [key]);

  useEffect(() => {
    if (previousKeyRef.current === key) return;
    previousKeyRef.current = key;

    const elapsed = Date.now() - loadStartedAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    clearAllTimers();

    completeTimerRef.current = setTimeout(() => {
      setPhase("complete");
      resetTimerRef.current = setTimeout(() => setPhase("idle"), 400);
    }, remaining);

    return () => clearAllTimers();
  }, [key]);

  useEffect(() => clearAllTimers, []);

  const width = phase === "idle" ? "0%" : phase === "loading-start" ? START_WIDTH : phase === "loading-creep" ? CREEP_WIDTH : "100%";
  const visible = phase !== "idle";

  return (
    <div className="h-[3px] w-full overflow-hidden" aria-hidden="true">
      <div
        className="h-full bg-brand"
        style={
          reducedMotion
            ? { width, opacity: visible ? 1 : 0 }
            : {
                width,
                opacity: visible ? 1 : 0,
                transition:
                  phase === "loading-start"
                    ? "width 150ms ease-out"
                    : phase === "loading-creep"
                      ? "width 1000ms ease-out"
                      : phase === "complete"
                        ? "width 150ms ease-out, opacity 200ms ease-in 150ms"
                        : "opacity 150ms ease-out",
              }
        }
      />
    </div>
  );
}
