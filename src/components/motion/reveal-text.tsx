"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { assignLines, SplitWords } from "@/lib/text/split-words.tsx";

/**
 * M3 mask reveal for short display text.
 *
 *   trigger="view"  words rise when the element scrolls into view (IntersectionObserver)
 *   trigger="load"  words rise on first paint (pure CSS; used in the hero)
 *   mode="words"    stagger word by word
 *   mode="lines"    stagger line by line (lines measured after fonts load)
 *
 * The hidden state only applies when the pre-paint script set
 * html[data-reveal="on"] (motion allowed), so text is visible with JS off and
 * under reduced motion. A CSS safety timer reveals anyway after 4 s.
 */
export function RevealText({
  as: Tag = "span",
  text,
  trailing,
  trigger = "view",
  mode = "words",
  offset,
  className = "",
  id,
}: {
  as?: ElementType;
  text: string;
  trailing?: ReactNode;
  trigger?: "view" | "load";
  mode?: "words" | "lines";
  offset?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ro: ResizeObserver | undefined;
    if (mode === "lines") {
      const measure = () => assignLines(el);
      document.fonts.ready.then(measure).catch(measure);
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }

    let io: IntersectionObserver | undefined;
    if (trigger === "view") {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            el.classList.add("is-in");
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(el);
    }

    return () => {
      ro?.disconnect();
      io?.disconnect();
    };
  }, [mode, trigger]);

  return (
    <Tag
      ref={ref}
      id={id}
      data-mode={mode}
      className={`${trigger === "view" ? "rv" : "rv-load"} ${className}`}
    >
      <SplitWords text={text} trailing={trailing} offset={offset} />
    </Tag>
  );
}
