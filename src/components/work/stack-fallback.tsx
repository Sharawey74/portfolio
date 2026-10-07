"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/motion/smooth-scroll.tsx";

/**
 * M6 fallback for browsers without CSS scroll timelines (Firefox in 2026):
 * Lenis' own scroll callback writes --stack-p (0..1) on each stack item, which
 * the CSS turns into the same scale-and-dim. No scroll event listener. With
 * native support, or under reduced motion (no Lenis), it does nothing.
 */
export function StackFallback() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (CSS.supports("(animation-timeline: view()) and (animation-range: entry)")) return;
    const items = [...document.querySelectorAll<HTMLElement>(".stack-item")];
    if (items.length < 2) return;
    const update = () => {
      for (let i = 0; i < items.length - 1; i++) {
        const next = items[i + 1]!.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 while the next card is below the fold, 1 once it has covered this one.
        const p = Math.max(0, Math.min(1, (vh - next.top) / vh));
        items[i]!.style.setProperty("--stack-p", p.toFixed(3));
      }
    };
    update();
    document.documentElement.dataset.stackFallback = "";
    lenis.on("scroll", update);
    return () => {
      lenis.off("scroll", update);
      delete document.documentElement.dataset.stackFallback;
    };
  }, [lenis]);
  return null;
}
