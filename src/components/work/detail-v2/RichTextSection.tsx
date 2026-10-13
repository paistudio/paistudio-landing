"use client";

import { revealStyle, useReduceMotion, useScrollDriver } from "@/lib/scroll/useScrollDriver";

type RichTextSectionProps = {
  /** One HTML string per paragraph — written via the Work CMS's
   * `RichParagraphField` (bold/italic/link only, via the browser's
   * `execCommand`), trusted CMS-authored content, not public user input. */
  paragraphs: string[];
  revealId: string;
};

export function RichTextSection({ paragraphs, revealId }: RichTextSectionProps) {
  const { revealed } = useScrollDriver();
  const reduceMotion = useReduceMotion();

  return (
    <div
      data-reveal="1"
      data-reveal-id={revealId}
      className="pai-container mx-auto flex w-full max-w-[840px] flex-col gap-5 px-10 py-16 max-[900px]:px-7 max-[560px]:px-5"
      style={revealStyle(revealed, revealId, reduceMotion)}
    >
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="m-0 text-[18px] leading-[1.6] text-muted [&_a]:text-brand [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      ))}
    </div>
  );
}
