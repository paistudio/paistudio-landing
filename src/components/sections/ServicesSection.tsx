"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ToolTab = {
  /** Tab label — also doubles as the right-column panel's subheading. */
  label: string;
  /** 1-2 sentences. */
  description: string;
  /** Describes what the (currently placeholder) screenshot would show —
   * e.g. "Pipeline kanban board". Purely a placeholder caption, not a
   * real image src/alt yet; see the component doc comment. Ignored if
   * `image` is passed. */
  previewLabel?: string;
  /** Optional real screenshot for this tab's panel, in place of the
   * placeholder box — e.g. /saas-web-app-development's "API & AI
   * Integration" tab uses `/services/integrations.png`. Every other tab
   * on every page omits this and keeps the plain placeholder. */
  image?: { src: string; alt: string };
};

type ServicesSectionProps = {
  /** Large heading, e.g. "Your Partner in Building SaaS Products, Efficiently." */
  headline: string;
  /** One tab + one scrolling panel each. Originally spec'd/built for
   * exactly 3; the real content this shipped with ended up being 5 items,
   * so the count is no longer fixed — any number renders correctly. */
  tools: ToolTab[];
};

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** SEC-03 · Services — redesigned on direct request from the original
 * spec's static numbered vertical list into a sticky-sidebar,
 * scroll-spy layout: a fixed left column (large heading, tab list) that
 * stays pinned while the right column's stack of content panels scrolls
 * underneath it, with the active tab tracking whichever panel is
 * currently aligned near the top of the viewport. The pill eyebrow label
 * this originally shipped with was removed on a follow-up request.
 *
 * Scroll-spy is the exact same technique this project already uses for
 * the blog article page's table of contents
 * (`components/blog/detail/TableOfContents.tsx`) — an `IntersectionObserver`
 * over each panel, picking whichever intersecting panel's top edge is
 * closest to the viewport top, rather than a new scroll-position
 * mechanism. `rootMargin` is tuned the same way: a negative top margin so
 * a panel only "counts" once its heading has cleared the sticky nav, and
 * a large negative bottom margin so only the panel or two nearest the top
 * of the viewport are ever candidates.
 *
 * The sticky release at the end of the last panel isn't special-cased —
 * it falls out of plain `position: sticky` + CSS Grid: the left column's
 * grid cell stretches to the row's height (the right column's, since it's
 * far taller), so the sticky element naturally stops being able to stick
 * once its cell runs out, exactly at the end of the right column's
 * content. Same structural pattern `ArticleSidebar`/`ArticleBody` already
 * use for the blog article layout.
 *
 * "Blue" active state from the request became this project's actual
 * accent (`--color-brand`, green) — there's no blue anywhere in this
 * project's palette, and introducing one for a single component would
 * break "follow the existing styling approach."
 *
 * Placeholder screenshots by default — `#E0E0E0`, the lightest grey
 * already established for image placeholders elsewhere in this project
 * (`ContainedImage`/`SplitImageRow`/`ValuePillarsSection`). A tab can opt
 * into a real screenshot instead via its own `image` prop (`next/image` +
 * `object-cover`, same `16 / 10` aspect ratio) — added on request for
 * /saas-web-app-development's "API & AI Integration" tab; every other
 * tab everywhere else still renders the plain placeholder.
 *
 * Tab list items have no left border at rest — only the active tab shows
 * one (`border-l-2 border-transparent` vs `border-l-2 border-brand`, so
 * the border is always reserved space, just invisible until active,
 * rather than the layout shifting by 2px when a tab activates).
 */
export function ServicesSection({ headline, tools }: ServicesSectionProps) {
  const [activeId, setActiveId] = useState(tools[0] ? slugify(tools[0].label) : "");

  useEffect(() => {
    const panels = tools
      .map((tool) => document.getElementById(slugify(tool.label)))
      .filter((el): el is HTMLElement => el !== null);
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [tools]);

  return (
    <section data-nav-bg="light" className="pai-container mx-auto w-full max-w-[1240px] px-10 py-20 max-[900px]:px-7 max-[560px]:px-5">
      <div className="grid grid-cols-[360px_1fr] gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-10">
        <div className="sticky top-[104px] flex h-fit flex-col gap-6 max-[900px]:static">
          <h2 className="m-0 text-[40px] leading-[1.15] font-bold tracking-[-0.02em] text-text text-balance">
            {headline}
          </h2>

          <nav aria-label="Tabs" className="mt-4 flex flex-col gap-2">
            {tools.map((tool) => {
              const id = slugify(tool.label);
              const isActive = id === activeId;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isActive}
                  className={`border-l-2 py-1 pl-4 text-[16px] no-underline transition-colors duration-300 ${
                    isActive ? "border-brand font-semibold text-brand" : "border-transparent font-normal text-muted"
                  }`}
                >
                  {tool.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col">
          {tools.map((tool) => {
            const id = slugify(tool.label);
            return (
              <div key={id} id={id} className="py-14 first:pt-0">
                <h3 className="m-0 mb-3 text-[26px] leading-[1.2] font-medium tracking-[-0.01em] text-text">
                  {tool.label}
                </h3>
                <p className="m-0 mb-7 max-w-[520px] text-[16px] leading-[1.6] text-muted">{tool.description}</p>
                {tool.image ? (
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-[32px]"
                    style={{
                      aspectRatio: "16 / 10",
                      background: "linear-gradient(180deg, #04070b 0%, #040c11 30%, #06102e 60%, #0b3d91 100%)",
                    }}
                  >
                    <Image src={tool.image.src} alt={tool.image.alt} fill className="object-cover" />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center overflow-hidden rounded-[32px]"
                    style={{
                      aspectRatio: "16 / 10",
                      background: "linear-gradient(180deg, #04070b 0%, #040c11 30%, #06102e 60%, #0b3d91 100%)",
                    }}
                  >
                    <span className="text-[12px] tracking-[0.1em] text-white/50 uppercase">
                      Image placeholder{tool.previewLabel ? ` — ${tool.previewLabel}` : ""}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
