"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";

const MAX_TILT = 4; // degrees, per the brief
const EASE = 0.14;

/**
 * M7 card surface: a cursor spotlight (a radial alpha mask that reveals a
 * hairline grid under the pointer, no color) and a tilt of at most 4°.
 * Fine pointer and motion allowed only; coarse pointers get a flat card.
 * Tilt uses `transform`, so it composes with the stack's `scale` animation.
 */
export function InteractiveCard({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { finePointer, allowMotion } = useMotionPrefs();
  const enabled = finePointer && allowMotion;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const target = { rx: 0, ry: 0 };
    const cur = { rx: 0, ry: 0 };
    let stop: (() => void) | null = null;

    const frame = () => {
      cur.rx += (target.rx - cur.rx) * EASE;
      cur.ry += (target.ry - cur.ry) * EASE;
      el.style.transform = `perspective(1200px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      if (Math.abs(target.rx - cur.rx) < 0.01 && Math.abs(target.ry - cur.ry) < 0.01) {
        stop?.();
        stop = null;
      }
    };
    const run = () => {
      if (!stop) stop = subscribe(frame, "input");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      el.dataset.spot = "";
      target.ry = (px - 0.5) * 2 * MAX_TILT;
      target.rx = -(py - 0.5) * 2 * MAX_TILT;
      run();
    };
    const onLeave = () => {
      delete el.dataset.spot;
      target.rx = 0;
      target.ry = 0;
      run();
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      stop?.();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.transform = "";
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
