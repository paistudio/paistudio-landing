"use client";

import { DM_Mono, Inter } from "next/font/google";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Self-contained fonts — loaded here (not in the shared root layout) so
// this experiment section doesn't change typography anywhere else on the
// site. "A geometric sans for everything" -> Inter; "a mono for the
// eyebrow label" -> DM Mono, per the spec.
const inter = Inter({ subsets: ["latin"], variable: "--sw-sans" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: "500", variable: "--sw-mono" });

type SelectedWorkProject = {
  id: string;
  client: string;
  headline: string;
  tags: string[];
  /** Random picks from content/images/assets-v2 (served from
   * public/work-gallery/) that cross-fade in the media frame — picked
   * arbitrarily, not matched to each card's dummy client. */
  images: string[];
  href: string;
};

const projects: SelectedWorkProject[] = [
  {
    id: "northbridge",
    client: "Northbridge Labs",
    headline: "Cut onboarding time from three weeks to two days",
    tags: ["SaaS", "Onboarding", "Automation"],
    images: [
      "/work-gallery/internal-tools-4-capit.png",
      "/work-gallery/mp-1-rooma-product-details.png",
      "/work-gallery/ai-3-linkgenius-shotgun.png",
      "/work-gallery/saas-5-surte.png",
    ],
    href: "#",
  },
  {
    id: "fieldstone",
    client: "Fieldstone",
    headline: "Automated manual reporting across twelve regional teams",
    tags: ["Internal Tools", "Reporting", "Dashboards"],
    images: [
      "/work-gallery/automation-1-persyon.png",
      "/work-gallery/mp-4-dispro-property-details.png",
      "/work-gallery/hellorecruiter-browse.png",
    ],
    href: "#",
  },
  {
    id: "harbor-co",
    client: "Harbor & Co",
    headline: "Launched a two-sided marketplace in six weeks flat",
    tags: ["Marketplace", "Payments", "MVP"],
    images: [
      "/work-gallery/saas-2-lawservice-dashboard.png",
      "/work-gallery/internal-tools-1-qt.png",
      "/work-gallery/wwaave-browse.png",
      "/work-gallery/ai-1-capit-dashboard.png",
      "/work-gallery/mp-5-kamily-browse-provider.png",
    ],
    href: "#",
  },
  {
    id: "glassline",
    client: "Glassline",
    headline: "Replaced three disconnected tools with one unified workspace",
    tags: ["SaaS", "Integrations", "Workflow"],
    images: [
      "/work-gallery/qrafter-orders.png",
      "/work-gallery/automation-4-dispro-dashboard.png",
      "/work-gallery/saas-6-stg-agreement-details.png",
      "/work-gallery/internal-tools-3-surte.png",
    ],
    href: "#",
  },
];

type TriggerRef = { current: HTMLDivElement | null };

function SelectedWorkCard({
  index,
  isLast,
  project,
  triggerRef,
  nextTriggerRef,
  reducedMotion,
}: {
  index: number;
  isLast: boolean;
  project: SelectedWorkProject;
  triggerRef: TriggerRef;
  nextTriggerRef: TriggerRef | undefined;
  reducedMotion: boolean;
}) {
  const articleRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Unrelated to the stacking animation below — purely pauses the
  // multi-image cross-fade inside the card when it's scrolled off-screen.
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion || project.images.length <= 1) return;
    const id = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % project.images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [inView, reducedMotion, project.images.length]);

  // Same "stacking cards" engine as StackedFeatureCards.tsx (#our-work-v3):
  // outgoing card driven by the next trigger crossing viewport centre,
  // incoming image driven by this card's own trigger entering/reaching
  // the viewport's bottom.
  const { scrollYProgress: outProgress } = useScroll({
    target: nextTriggerRef ?? triggerRef,
    offset: ["start 0.5", "end 0.5"],
  });
  const outScale = useTransform(outProgress, [0, 1], [1, 0.9]);
  const outY = useTransform(outProgress, [0, 1], [0, -24]);
  const outOpacity = useTransform(outProgress, [0, 1], [1, 0]);

  const { scrollYProgress: inProgress } = useScroll({
    target: triggerRef,
    offset: ["start end", "end end"],
  });
  const imageScale = useTransform(inProgress, [0, 1], [1.1, 1]);
  const imageOpacity = useTransform(inProgress, [0, 1], [0, 1]);

  return (
    <div className="sticky top-[120px] mb-8 max-[810px]:top-[80px]" style={{ zIndex: index + 1 }}>
      <motion.article
        ref={articleRef}
        className="rounded-[12px] bg-[#f6f6f6] p-[56px] max-[1024px]:p-10 max-[640px]:p-8"
        style={{
          willChange: "transform",
          transformOrigin: "top center",
          scale: reducedMotion || isLast ? 1 : outScale,
          y: reducedMotion || isLast ? 0 : outY,
          opacity: reducedMotion || isLast ? 1 : outOpacity,
        }}
      >
        <div className="grid grid-cols-12 items-stretch gap-[56px] max-[1024px]:grid-cols-1 max-[1024px]:gap-10">
          <div className="col-span-4 flex flex-col justify-between max-[1024px]:col-span-12 max-[1024px]:gap-10">
            <div>
              <div className="flex h-7 items-center text-[15px] font-semibold tracking-[-0.01em] text-[rgba(22,18,24,0.72)]">
                {project.client}
              </div>
              <h3 className="mt-10 text-[40px] leading-[48px] font-semibold tracking-[-0.03em] text-[rgb(22,18,24)] [text-wrap:balance] max-[1024px]:text-[30px] max-[1024px]:leading-[1.2]">
                {project.headline}
              </h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[rgba(22,18,24,0.12)] bg-white px-3 py-1 text-[14px] font-normal text-[rgba(22,18,24,0.66)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={project.href}
              className="inline-flex h-9 w-fit items-center gap-1 rounded-full border border-[rgba(22,18,24,0.12)] bg-white pr-3 pl-4 text-[14px] font-semibold text-[rgb(22,18,24)] transition-colors duration-200 hover:bg-[rgba(22,18,24,0.06)]"
            >
              View case study
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <motion.div
            className="relative col-span-8 overflow-hidden rounded-[12px] border border-[rgba(22,18,24,0.12)] max-[1024px]:col-span-12"
            style={{
              aspectRatio: "16 / 10",
              willChange: "transform",
              scale: reducedMotion ? 1 : imageScale,
              opacity: reducedMotion ? 1 : imageOpacity,
            }}
          >
            {project.images.map((src, i) => (
              <div
                key={src}
                className="absolute inset-0"
                style={{ opacity: i === activeImage ? 1 : 0, transition: "opacity 700ms ease-out" }}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}

export function SelectedWork() {
  const reducedMotion = useReducedMotion() ?? false;
  // Plain `{ current }` objects shaped like refs, not `useRef` calls —
  // see the matching comment in StackedFeatureCards.tsx for why.
  const triggerRefs = useMemo<TriggerRef[]>(
    () => Array.from({ length: projects.length }, () => ({ current: null })),
    []
  );

  return (
    <section
      id="our-work-v2"
      className={`${inter.variable} ${dmMono.variable} relative z-1 bg-white px-10 py-24 font-[family-name:var(--sw-sans)] max-[640px]:px-5`}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-20 text-center max-[640px]:mb-14">
          <p className="font-[family-name:var(--sw-mono)] text-[12px] font-medium uppercase tracking-[0.02em] text-[rgba(22,18,24,0.5)]">
            Selected Work
          </p>
          <h2 className="mt-3 text-[52px] leading-[1.12] font-semibold tracking-[-0.03em] text-[rgb(22,18,24)] max-[640px]:text-[32px]">
            Work that speaks for itself.
          </h2>
        </div>

        {/* Same "direct siblings, no per-card row" structure as
            StackedFeatureCards.tsx — see that file's comment for why. */}
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {projects.map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  triggerRefs[i].current = el;
                }}
                style={{ height: `${100 / projects.length}%` }}
              />
            ))}
          </div>

          {projects.map((project, i) => (
            <SelectedWorkCard
              key={project.id}
              index={i}
              isLast={i === projects.length - 1}
              project={project}
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
