"use client";

import { useEffect, useRef } from "react";

/**
 * A decorative element whose CSS loop should run only while it is on screen
 * (motion rules: every loop pauses off-screen). Sets `data-visible` while any
 * part of it intersects the viewport; the CSS pauses the animation otherwise.
 * The global pause and reduced motion are handled in the CSS.
 */
export function LoopGate({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) el.dataset.visible = "";
      else delete el.dataset.visible;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} aria-hidden="true" className={className} />;
}
