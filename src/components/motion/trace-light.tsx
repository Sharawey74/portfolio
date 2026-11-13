"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lights the trace nodes inside it (docs/ISSUES.md ISS-55): each descendant
 * marked `data-node` gets `data-lit` the first time it scrolls past the lower
 * third of the viewport, and keeps it. CSS decides what lit means (a filled
 * node, its glow, its connector drawn). The unlit look applies only under
 * html[data-reveal="on"], so with JS off or reduced motion every node shows
 * lit and nothing waits on this observer. One-shot: not autoplay, so the
 * pause control leaves it be.
 */
export function TraceLight({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || document.documentElement.dataset.reveal !== "on") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-lit", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    root.querySelectorAll("[data-node]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-trace="" className={className}>
      {children}
    </div>
  );
}
