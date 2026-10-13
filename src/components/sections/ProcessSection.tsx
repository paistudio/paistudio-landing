"use client";

import Image from "next/image";

// One preview image per step, matched by index (step 1 → process-a, step
// 2 → process-b, step 3 → process-c) — not a per-item crossfade, on
// request ("itu kan ada steps di section itu. step satu pake gambar
// process-1, step 2 pake process-2, dan seterusnya"), replacing an
// earlier version of this component where every item cycled through all
// 3 images. Generic/illustrative product-UI shots (scoping checklist →
// design/dev/AI pipeline → results dashboard), not tied to any single
// page's specific offering, so the same 3 images are reused identically
// across every SEC-04 page by default (a page can override any single
// step's image via that step's own `ServiceItem.image` instead — see
// marketplace-development's step 1) rather than requiring per-page image
// props for every step. Every page's `items` array is exactly 3 long (see
// the `items.length` dev-only check below), so the index mapping lines up
// 1:1 with no leftover step. Real source dimensions are 1030×642 (~16:10,
// matching this component's own preview aspect ratio almost exactly), so
// `object-cover` crops only marginally.
const PROCESS_STEP_IMAGES = [
  { src: "/process/process-a.png", alt: "Project scoping checklist" },
  { src: "/process/process-b.png", alt: "Design, development, and AI services pipeline" },
  { src: "/process/process-c.png", alt: "Active users and revenue results dashboard" },
];

type ServiceItem = {
  title: string;
  /** Shown only while this item is active/expanded. */
  description: string;
  /** Optional override for this step's default index-based image from
   * `PROCESS_STEP_IMAGES` — e.g. marketplace-development's step 1 uses
   * `process-4.png` (a checkout-flow shot) instead of the default
   * `process-1.png`, on request. Every other page/item omits this and
   * keeps the default mapping. */
  image?: { src: string; alt: string };
};

type ProcessSectionProps = {
  /** Large heading in the sticky left column — wraps across multiple
   * lines naturally at the column's ~35% width, not an explicit forced
   * line break. */
  headline: string;
  /** Supporting paragraph under the headline. */
  subhead: string;
  /** 3–4 items. */
  items: ServiceItem[];
};

// The left column's own sticky `top` (matches this project's established
// nav-clearance convention, e.g. ServicesSection's sticky sidebar) — item
// 0's `top` starts here too.
const NAV_CLEARANCE = 104;
// Must exactly match `.service-header`'s own fixed height (`h-16` = 64px,
// see the header row below) — each subsequent item's `top` offset is one
// more header-height than the last, which is what makes the stacked-
// header illusion line up with no gaps or overlaps. See the component
// doc comment for why this has to match precisely.
const HEADER_HEIGHT = 64;

/** This step's single preview image — `item.image` if the page overrode
 * it for this specific step, else the default `PROCESS_STEP_IMAGES[index]`.
 * Static, not a crossfade (see `PROCESS_STEP_IMAGES`'s doc comment for why
 * the default mapping is index-based rather than always a page-supplied
 * prop). */
function ServiceItemBody({ item, index }: { item: ServiceItem; index: number }) {
  const image = item.image ?? PROCESS_STEP_IMAGES[index % PROCESS_STEP_IMAGES.length];
  return (
    <div className="flex flex-col gap-6 pt-6 pb-10">
      <p className="m-0 max-w-[520px] text-[16px] leading-[1.6] text-muted">{item.description}</p>
      <div
        className="relative w-full max-w-[520px] overflow-hidden rounded-[24px] bg-[#E0E0E0]"
        style={{ aspectRatio: "16 / 10" }}
      >
        <Image src={image.src} alt={image.alt} fill className="object-cover" />
      </div>
    </div>
  );
}

/** SEC-04 · Services — pure-CSS sticky-stacking-cards accordion. No
 * scroll-linked JS at all for the core collapse effect — this replaced
 * an earlier GSAP `ScrollTrigger` scrub-driven version entirely, on
 * request ("use this for scroll animation" + the exact sticky-stacking
 * technique below).
 *
 * **How it actually works** — it's genuinely just `position: sticky` +
 * `z-index` layering, not a height/opacity animation of any kind:
 * - The right-column `<ul>` is `position: relative`.
 * - Every `<li>` is ALSO `position: sticky`, each with a progressively
 *   larger `top` (`NAV_CLEARANCE + i * HEADER_HEIGHT`) — item 0 pins
 *   right under the nav, item 1 pins one header-height lower, item 2 two
 *   header-heights lower, and so on.
 * - Every `<li>` has an opaque `bg-paper` background and an increasing
 *   `z-index` (`i + 1`, inline style since it's dynamic per index), so
 *   later items in the DOM paint over earlier ones once they scroll into
 *   their own pinned position. Deliberately no `overflow: hidden`
 *   anywhere in this chain.
 * - `.service-header` (number + title) is a fixed `h-16` row sitting
 *   flush at the very top of its `<li>` — always visible, identical
 *   markup regardless of scroll position, no "active" class needed at
 *   all. Its height must equal `HEADER_HEIGHT` exactly (both are 64px,
 *   kept in sync by the constant + the `h-16` class): the visible
 *   "sliver" of an already-passed item is exactly the vertical distance
 *   between its own `top` and the *next* item's `top`, which is only
 *   guaranteed to equal one full, uncropped header row if nothing (e.g.
 *   padding) sits above the header inside the `<li>`.
 * - `.service-body` (description, preview, tags) is ordinary content in
 *   normal flow directly below the header, inside the same sticky
 *   `<li>` — no height animation, no opacity toggle, no JS touches it at
 *   all. It's simply visible whenever its `<li>` is the topmost pinned
 *   box, and gets visually covered by the *next* `<li>`'s opaque box
 *   sliding up over it as that one reaches its own `top` and pins in
 *   turn.
 * - Total scroll-runway height is just the natural sum of every item's
 *   real rendered height — no manual `min-h` slots, no artificial
 *   spacing, no `IntersectionObserver`, no scroll library. The
 *   pin/release behavior falls out of plain `position: sticky` once the
 *   (naturally tall) list runs out, same as `ServicesSection`'s own
 *   sticky sidebar.
 *
 * **Reduced motion**: nothing to gate — unlike the previous GSAP version,
 * this is plain CSS positioning following the user's own scroll, not an
 * autoplaying/continuous-motion effect (the same reasoning this site's
 * fixed `Nav` bar isn't gated behind that preference either). The per-step
 * preview image is a static `next/image` per step (see
 * `PROCESS_STEP_IMAGES`) — it used to be a `prefers-reduced-motion`-aware
 * autoplaying crossfade across all 3 images, but that no longer applies
 * now that each step shows just its own one matching image.
 *
 * **Mobile (`≤900px`, matching SEC-03's breakpoint)**: both the left
 * column and every `<li>` drop `position: sticky` to `static`. Once
 * items aren't sticky they stop stacking/covering each other at all, and
 * each item's full header+body just flows normally in the document —
 * which *is* "list them all expanded" for free, with zero extra logic.
 * No separate mobile DOM branch needed at all (the previous GSAP version
 * needed one; this technique doesn't).
 *
 * **No pills/tags** — `ServiceItem` originally had a `tags: string[]`
 * field rendered as pill badges under the preview image; removed
 * entirely on request ("remove pill di dalam accordion"), not just
 * hidden — the prop is gone from the type too.
 *
 * **Headline/first-item top alignment**: the left column used to carry
 * its own `py-20`, independent of the section's own padding — which,
 * since the right column's `<ul>` has no padding of its own, put the
 * headline ~80px lower than "01 [title]" instead of level with it. Fixed
 * by moving vertical spacing to the *section* itself (`py-20`) and
 * dropping the left column's own padding entirely — matching how
 * `ServicesSection` (SEC-03) structures the exact same two-column
 * layout, on request ("biar konsisten kaya section lain"). Both columns
 * now start flush at the same top edge. */
export function ProcessSection({ headline, subhead, items }: ProcessSectionProps) {
  if (process.env.NODE_ENV !== "production" && (items.length < 3 || items.length > 4)) {
    console.error(`ProcessSection (SEC-04): expected 3–4 items, got ${items.length}.`);
  }

  return (
    <section data-nav-bg="light" className="pai-container mx-auto w-full max-w-[1240px] px-10 py-20 max-[900px]:px-7 max-[560px]:px-5">
      <div className="grid grid-cols-[35%_1fr] gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
        {/* Left column: sticky on desktop, static on mobile. No padding
            of its own — top-aligned flush with the right column's first
            item, matching the section-level `py-20` every sibling
            section in this library uses instead of column-level padding
            (e.g. ServicesSection). */}
        <div className="sticky flex h-fit flex-col items-start gap-[18px] max-[900px]:static" style={{ top: NAV_CLEARANCE }}>
          <h2 className="m-0 text-[56px] leading-[1.05] font-bold tracking-[-0.02em] text-text text-balance max-[900px]:text-[36px]">
            {headline}
          </h2>
          <p className="m-0 max-w-[380px] text-[16px] leading-[1.6] text-muted">{subhead}</p>
        </div>

        {/* Right column: sticky-stacking-cards accordion (see doc comment above) */}
        <ul className="relative m-0 flex list-none flex-col border-b border-ink/10 p-0">
          {items.map((item, i) => (
            <li
              key={i}
              className="sticky border-t border-ink/10 bg-paper max-[900px]:static"
              style={{ top: NAV_CLEARANCE + i * HEADER_HEIGHT, zIndex: i + 1 }}
            >
              <div className="flex h-16 items-center gap-4">
                <span className="text-[24px] font-bold tracking-[-0.01em] text-ink/30 max-[900px]:text-[20px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="m-0 text-[24px] font-bold tracking-[-0.01em] text-text max-[900px]:text-[20px]">{item.title}</h3>
              </div>
              <ServiceItemBody item={item} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
