"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type StackedCardData = {
  label: string;
  title: string;
  body: string;
  footer: string;
  image: { src: string; alt: string };
};

type StackedFeatureCardsProps = {
  cards: StackedCardData[];
  /** Passed straight through to the root `<section>` so a page can target
   * it (e.g. an anchor link or a distinct DOM id for its own section). */
  id?: string;
};

type TriggerRef = { current: HTMLDivElement | null };

function StackedCard({
  index,
  isLast,
  card,
  triggerRef,
  nextTriggerRef,
  reducedMotion,
}: {
  index: number;
  isLast: boolean;
  card: StackedCardData;
  triggerRef: TriggerRef;
  nextTriggerRef: TriggerRef | undefined;
  reducedMotion: boolean;
}) {
  // Outgoing (this card, being covered by the next one): progress runs
  // 0 → 1 while the *next* card's trigger crosses the viewport's
  // vertical centre. The last card has no next trigger to read, so the
  // hook falls back to its own trigger — a valid target is still
  // required, but `isLast` below means this progress is never applied.
  const { scrollYProgress: outProgress } = useScroll({
    target: nextTriggerRef ?? triggerRef,
    offset: ["start 0.5", "end 0.5"],
  });
  const outScale = useTransform(outProgress, [0, 1], [1, 0.9]);
  const outY = useTransform(outProgress, [0, 1], [0, -24]);
  const outOpacity = useTransform(outProgress, [0, 1], [1, 0]);

  // Incoming image: progress runs 0 → 1 from this card's own trigger
  // entering the bottom of the viewport until that trigger's bottom
  // reaches the bottom of the viewport.
  const { scrollYProgress: inProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end end"],
  });
  const imageScale = useTransform(inProgress, [0, 1], [1.1, 1]);
  const imageOpacity = useTransform(inProgress, [0, 1], [0, 1]);

  // Alternate sides: card 1 (index 0) image right, card 2 image left,
  // card 3 image right. DOM order stays fixed (copy, then image); `order`
  // controls visual placement on desktop, with a mobile override below
  // forcing the image first regardless of the alternation.
  const imageRight = index % 2 === 0;

  return (
    <div className="sticky top-[120px] mb-8 max-[810px]:top-[80px]" style={{ zIndex: index + 1 }}>
      {/* Animated element is this inner wrapper, never the sticky div
          itself — a transform on the sticky element breaks its own
          stickiness. */}
      <motion.div
        className="h-[628px] w-full overflow-hidden rounded-[16px] border border-white/10 max-[810px]:h-auto"
        style={{
          background: "#0f0f0f",
          willChange: "transform",
          transformOrigin: "top center",
          scale: reducedMotion || isLast ? 1 : outScale,
          y: reducedMotion || isLast ? 0 : outY,
          opacity: reducedMotion || isLast ? 1 : outOpacity,
        }}
      >
        <div className="flex h-full max-[810px]:flex-col">
          <div className={`w-1/2 max-[810px]:w-full ${imageRight ? "order-1" : "order-2"} max-[810px]:order-2`}>
            <div className="flex h-full flex-col justify-between p-10 max-[810px]:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden="true" />
                  <span className="text-[12px] tracking-[0.08em] text-white/50 uppercase">{card.label}</span>
                </div>
                <h3 className="mt-4 text-[28px] leading-[1.2] font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-white/60">{card.body}</p>
              </div>
              <p className="text-[12px] text-white/35">{card.footer}</p>
            </div>
          </div>

          <div
            className={`relative w-1/2 p-2 max-[810px]:order-1 max-[810px]:h-[220px] max-[810px]:w-full ${
              imageRight ? "order-2" : "order-1"
            } max-[810px]:order-1`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a]">
              {/* This div clips the overflow so the image's 1.1 scale
                  never bleeds past its own rounded box. */}
              <div className="absolute inset-6 overflow-hidden rounded-[8px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                <motion.div
                  className="relative h-full w-full"
                  style={{
                    willChange: "transform",
                    scale: reducedMotion ? 1 : imageScale,
                    opacity: reducedMotion ? 1 : imageOpacity,
                  }}
                >
                  <Image src={card.image.src} alt={card.image.alt} fill className="object-cover" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function StackedFeatureCards({ cards, id }: StackedFeatureCardsProps) {
  const reducedMotion = useReducedMotion() ?? false;
  // Plain `{ current }` objects shaped like refs, not `useRef` calls —
  // the count of these depends on `cards.length`, and calling `useRef`
  // inside a loop/`.map()` to produce a variable number of refs isn't
  // allowed (violates the rules of hooks even when the count happens to
  // be stable in practice). `useMemo` keeps the same array of objects
  // across re-renders so the callback refs below don't lose what they
  // measured.
  const triggerRefs = useMemo<TriggerRef[]>(
    () => Array.from({ length: cards.length }, () => ({ current: null })),
    [cards.length]
  );

  return (
    <section id={id} className="bg-black px-10 py-24 max-[810px]:px-5">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-16 max-[810px]:mb-10">
          <span className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-[11px] tracking-[0.08em] text-white/60 uppercase">
            Features
          </span>
          <div className="mt-4 flex items-end justify-between gap-8 max-[810px]:flex-col max-[810px]:items-start max-[810px]:gap-3">
            <h2 className="text-[40px] leading-[1.1] font-semibold text-white max-[810px]:text-[28px]">
              Built for how you actually work.
              <br />
              <span className="text-white/40">Not how a demo pretends you do.</span>
            </h2>
            <p className="max-w-[320px] text-[14px] leading-[1.6] text-white/55 text-right max-[810px]:max-w-full max-[810px]:text-left">
              Three ways this comes together in a real product, not just a feature list.
            </p>
          </div>
        </div>

        {/* All cards are direct siblings of this div (no per-card row
            wrapper): a sticky element can only stay pinned for as much
            of its containing block's remaining height as is left below
            it, so boxing each card in its own row caps that at just
            that row's height. As direct siblings, every later card's
            own height extends how long an earlier one can stay pinned.
            No overflow/transform here or on any ancestor — either
            breaks sticky. */}
        <div className="relative">
          {/* Trigger layer: N equal-height invisible slices, used only
              as Motion `useScroll` targets — not for layout or visual
              content. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {cards.map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  triggerRefs[i].current = el;
                }}
                style={{ height: `${100 / cards.length}%` }}
              />
            ))}
          </div>

          {cards.map((card, i) => (
            <StackedCard
              key={card.label}
              index={i}
              isLast={i === cards.length - 1}
              card={card}
              triggerRef={triggerRefs[i]}
              nextTriggerRef={triggerRefs[i + 1]}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
