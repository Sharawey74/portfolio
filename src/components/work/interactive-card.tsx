"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";

/**
 * M7 card surface: a cursor spotlight (a soft neutral light and a hairline
 * grid revealed by a radial mask under the pointer, no color). Since Stage
 * 7.5 the card lifts 2 px on hover (`.lift` in CSS) instead of tilting, as in
 * the approved mock-up. Fine pointer and motion allowed only; coarse pointers
 * get a flat card. Pointer moves write two custom properties, no layout.
 */
export function InteractiveCard({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { finePointer, allowMotion } = useMotionPrefs();
  const enabled = finePointer && allowMotion;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      el.dataset.spot = "";
    };
    const onLeave = () => {
      delete el.dataset.spot;
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      delete el.dataset.spot;
    };
  }, [enabled]);

  return (
    <div ref={ref} className={`card-surface ${className}`}>
      <div aria-hidden="true" className="card-spot" />
      {children}
    </div>
  );
}
