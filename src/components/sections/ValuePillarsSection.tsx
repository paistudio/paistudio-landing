"use client";

import Image from "next/image";
import { useState } from "react";

type Pillar = {
  title: string;
  description: string;
  /** Describes what the preview image shows — e.g. "Create account form".
   * Used as the placeholder caption when `previewImage` is omitted. */
  previewLabel?: string;
  /** Real image shown in the hover-reveal panel instead of the
   * placeholder caption. Omit to keep the placeholder (every pillar not
   * explicitly given one). */
  previewImage?: { src: string; alt: string };
};

type ValuePillarsSectionProps = {
  /** Exactly 3 — redesigned from the original spec's 4-pillar 2×2 grid to
   * a 3-column hover-expand layout, on direct request. */
  pillars: Pillar[];
  /** Hovered-card background — `bg-deep` by default, consistent across
   * every "What We Build" page (was `bg-ink`, briefly `bg-deep` only on AI
   * Products — made uniform on request). Override only if a future page
   * genuinely needs a different hover color. */
  hoverBgClassName?: string;
};

/** SEC-02 · Value Pillars — redesigned on direct request from the
 * original spec's static 4-card 2×2 grid into a 3-card horizontal strip,
 * all sitting in one light-gray rounded container, with a hover
 * interaction: the hovered card grows (others shrink to make room) and a
 * product-preview image reveals inside it.
 *
 * Each card's own content is an h-stack, not a v-stack with an
 * absolutely-positioned image overlay (an earlier pass here did that) —
 * text and the preview image are two ordinary flex children sharing the
 * card, so the image sits inside the card's own padding like the text
 * does, rather than bleeding past it via negative offsets. The 50/50
 * split only happens *while hovered*: at rest the image column's
 * `flex-grow`/opacity are both 0 (zero width, invisible) so text alone
 * fills the card; on hover both columns animate to equal `flex-grow`
 * (1:1 — genuinely 50/50) while the image fades in. Text itself uses
 * `justify-between` (not a plain stacked v-stack) so the number+heading
 * group sits at the top and the description is pinned to the bottom of
 * the card's height, rather than just flowing top-down with a gap.
 *
 * Placeholder images only for now — `#E0E0E0`, the lightest grey already
 * established in this project for image placeholders (see
 * `ContainedImage`/`SplitImageRow` in `work/detail-v2/`) — lighter than
 * the `#d9d7d0` placeholder tone this component (and `WorkGallery`'s
 * `GalleryTile`) used before. No real image props yet, still matching
 * this project's placeholder convention rather than wiring up
 * `next/image` against fabricated file paths.
 *
 * Width changes are `flex-grow` transitions (not `width`/`flex-basis`) —
 * animating `flex-grow` is well supported in evergreen browsers and is
 * the standard technique for both the card-level expand-on-hover and the
 * inner text/image 0→50/50 reveal, since a ratio between grow values does
 * the resizing automatically. Duration is 350ms ease-out throughout,
 * inside the spec's requested 300–400ms range.
 */
export function ValuePillarsSection({ pillars, hoverBgClassName = "bg-deep" }: ValuePillarsSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (process.env.NODE_ENV !== "production" && pillars.length !== 3) {
    console.error(`ValuePillarsSection (SEC-02): expected exactly 3 pillars, got ${pillars.length}.`);
  }

  return (
    <section data-nav-bg="light" className="pai-container mx-auto w-full max-w-[1240px] px-10 py-20 max-[900px]:px-7 max-[560px]:px-5">
      <div className="flex gap-2 rounded-[32px] bg-cream p-2 max-[700px]:flex-col">
        {pillars.map((pillar, i) => {
          const isHovered = hoveredIndex === i;
          return (
            <div
              key={pillar.title}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative flex min-h-[280px] basis-0 overflow-hidden rounded-[24px] p-8 transition-[flex-grow,background-color] duration-[350ms] ease-out max-[700px]:min-h-[240px] ${
                i > 0 ? "max-[700px]:border-t max-[700px]:border-ink/8" : ""
              } ${isHovered ? `${hoverBgClassName} shadow-[0_16px_40px_rgba(0,0,0,0.1)]` : "bg-transparent"}`}
              style={{ flexGrow: isHovered ? 1.7 : 1 }}
            >
              {/* h-stack: text column + image column, both ordinary flex
                  children sharing this card's own padding. */}
              <div className="flex w-full gap-5">
                <div
                  className="flex basis-0 flex-col justify-between transition-[flex-grow] duration-[350ms] ease-out"
                  style={{ flexGrow: 1 }}
                >
                  <div>
                    <span
                      className={`text-[13px] tracking-[0.04em] transition-colors duration-[350ms] ${isHovered ? "text-white/30" : "text-ink/30"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`m-0 mt-3 text-[22px] leading-[1.2] font-bold tracking-[-0.01em] transition-colors duration-[350ms] ${isHovered ? "text-white" : "text-text"}`}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                  <p
                    className={`m-0 text-[14px] leading-[1.6] transition-colors duration-[350ms] ${isHovered ? "text-white/70" : "text-muted"}`}
                  >
                    {pillar.description}
                  </p>
                </div>

                {/* Placeholder preview image — zero width/invisible at
                    rest, grows to match the text column (50/50) and fades
                    in on hover. */}
                <div
                  aria-hidden="true"
                  className={`relative basis-0 overflow-hidden rounded-[18px] transition-[flex-grow,opacity] duration-[350ms] ease-out ${pillar.previewImage ? "" : "bg-[#E0E0E0]"}`}
                  style={{ flexGrow: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
                >
                  {pillar.previewImage ? (
                    <Image src={pillar.previewImage.src} alt={pillar.previewImage.alt} fill className="object-contain p-6" />
                  ) : (
                    <div className="flex h-full min-w-[120px] items-center justify-center p-3 text-center">
                      <span className="text-[11px] tracking-[0.08em] text-muted uppercase">
                        Image placeholder{pillar.previewLabel ? ` — ${pillar.previewLabel}` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
