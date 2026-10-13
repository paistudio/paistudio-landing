"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
};

type ServicesAccordionProps = {
  services: ServiceItem[];
  /** Passed straight through to the root `<section>`. */
  id?: string;
};

const EASE = [0.44, 0, 0.56, 1] as const;
const CLOSED_HEIGHT = 79;
const OPEN_HEIGHT = 356;
const MOBILE_BREAKPOINT = 1024;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isMobile;
}

function PlusIcon({ isOpen, reducedMotion }: { isOpen: boolean; reducedMotion: boolean }) {
  return (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2"
      animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 0 : 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: EASE }}
    >
      <path d="M9 2V16M2 9H16" stroke="currentColor" strokeWidth="1" />
    </motion.svg>
  );
}

function AnimatedWords({ text, isOpen, reducedMotion }: { text: string; isOpen: boolean; reducedMotion: boolean }) {
  const words = text.split(" ");
  return (
    <p
      aria-label={text}
      className="absolute top-5 left-[60%] w-[40%] text-[18px] leading-[1.4] text-black max-[1024px]:static max-[1024px]:top-auto max-[1024px]:left-auto max-[1024px]:mt-14 max-[1024px]:w-full"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={false}
          animate={
            reducedMotion
              ? { opacity: isOpen ? 1 : 0, filter: "blur(0px)" }
              : isOpen
                ? { opacity: 1, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(4px)" }
          }
          transition={
            reducedMotion ? { duration: 0 } : { duration: 0.3, ease: EASE, delay: isOpen ? 0.15 + i * 0.015 : 0 }
          }
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

function AccordionRow({
  item,
  isOpen,
  openHeight,
  reducedMotion,
  onToggle,
  onKeyNav,
  buttonRef,
}: {
  item: ServiceItem;
  isOpen: boolean;
  openHeight: number | "auto";
  reducedMotion: boolean;
  onToggle: () => void;
  onKeyNav: (e: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const headerId = `services-header-${item.id}`;
  const panelId = `services-panel-${item.id}`;

  return (
    <motion.div
      className="relative overflow-hidden border-t border-black/15"
      initial={false}
      animate={{ height: isOpen ? openHeight : CLOSED_HEIGHT }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: EASE }}
    >
      <button
        ref={buttonRef}
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        onKeyDown={onKeyNav}
        className="absolute inset-0 z-10 w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      />
      <div id={panelId} role="region" aria-labelledby={headerId} className="pointer-events-none absolute inset-0">
        <motion.span
          initial={false}
          animate={{ opacity: isOpen ? 1 : 0.5 }}
          whileHover={isOpen ? undefined : { opacity: 0.8, transition: { duration: 0.2 } }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          className="pointer-events-auto absolute top-5 left-0 text-[30px] leading-[1.3] font-normal tracking-[-0.03em] text-black max-[1024px]:text-[24px]"
        >
          {item.title}
        </motion.span>

        <AnimatedWords text={item.description} isOpen={isOpen} reducedMotion={reducedMotion} />
        <PlusIcon isOpen={isOpen} reducedMotion={reducedMotion} />
      </div>
    </motion.div>
  );
}

export function ServicesAccordion({ services, id }: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const reducedMotion = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleToggle(index: number) {
    if (index === openIndex) return;
    setOpenIndex(index);
  }

  function handleKeyNav(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      buttonRefs.current[(index + 1) % services.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      buttonRefs.current[(index - 1 + services.length) % services.length]?.focus();
    }
  }

  return (
    <section id={id} className="bg-white px-10 py-24 text-black max-[1024px]:px-5">
      <div className="mb-[90px] max-[1024px]:mb-12">
        <div className="mb-4 flex items-center gap-2 text-[11px] tracking-[0.1em] text-black/40 uppercase">
          <span>01</span>
          <span className="h-1 w-1 rounded-full bg-black/40" aria-hidden="true" />
          <span>Services</span>
        </div>
        <h2 className="max-w-[55%] font-serif text-[40px] leading-[1.2] font-normal max-[1024px]:max-w-full max-[1024px]:text-[28px]">
          What we actually do, start to finish.
        </h2>
      </div>

      <div className="grid grid-cols-[38.4%_1fr] gap-[60px] max-[1024px]:grid-cols-1 max-[1024px]:gap-10">
        <div className="relative h-full overflow-hidden rounded-[12px] max-[1024px]:h-auto max-[1024px]:aspect-[4/3]">
          {services.map((item, i) => (
            <motion.div
              key={item.id}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === openIndex ? 1 : 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: EASE }}
            >
              <Image src={item.image.src} alt={item.image.alt} fill className="object-cover" />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col">
          {services.map((item, i) => (
            <AccordionRow
              key={item.id}
              item={item}
              isOpen={i === openIndex}
              openHeight={isMobile ? "auto" : OPEN_HEIGHT}
              reducedMotion={reducedMotion}
              onToggle={() => handleToggle(i)}
              onKeyNav={(e) => handleKeyNav(e, i)}
              buttonRef={(el) => {
                buttonRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
