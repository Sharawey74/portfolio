"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "@/lib/motion/use-in-view.ts";

/**
 * M6 infinite marquee. Pure CSS translate loop over two copies of the track
 * (the copy is aria-hidden). It runs only while in view (this component
 * toggles data-run), holds on hover and focus-within, and stops under the
 * global pause and reduced motion (CSS). The first copy is a normal list, so
 * the content reads fine without motion.
 */
export function Marquee({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="marquee" data-run={inView ? "" : undefined} role="region" aria-label={label}>
      <div className="marquee-track">
        <ul className="marquee-list">{children}</ul>
        <ul className="marquee-list" aria-hidden="true">
          {children}
        </ul>
      </div>
    </div>
  );
}
