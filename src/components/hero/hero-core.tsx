"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";

type CanvasProps = { active: boolean; still: boolean; tilt: boolean };

/**
 * Hero core (owner, 2026-10-11, docs/ISSUES.md ISS-51): the right column of
 * the owner's mock-up. In CSS, the reticle (four concentric rings fading
 * outward, crosshairs, diagonals), the white emitter at its centre and the
 * small ring on the left edge; between them, on a 2D canvas the size of the
 * column, the geodesic sphere, set 4.5 units right of the centre and cut by
 * the column edge as in the mock-up. Decorative and abstract: it labels
 * nothing, so it claims nothing (honesty rule 7).
 *
 * The canvas module loads only after the browser is idle, so it costs nothing
 * before the first paint (ISS-36). Its loop runs on the shared scheduler only
 * while the core is on screen, stops with the global pause, and under reduced
 * motion the sphere is drawn once and stays still. Save-Data keeps the CSS
 * reticle only. With a mouse, the sphere leans toward the pointer.
 * Hidden below 1280 px: at 1024 the 7-column text area is narrower than the
 * name at its 120 px size.
 */
export function HeroCore() {
  const { allowMotion, reducedMotion, saveData, finePointer } = useMotionPrefs();
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host);
  const [Canvas, setCanvas] = useState<ComponentType<CanvasProps> | null>(null);

  useEffect(() => {
    if (saveData || Canvas) return;
    if (!window.matchMedia("(min-width: 80rem)").matches) return;
    let cancelled = false;
    const load = () => {
      import("./hero-core-canvas.tsx").then((m) => {
        if (!cancelled) setCanvas(() => m.default);
      });
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [saveData, Canvas]);

  return (
    <div ref={host} aria-hidden="true" className="hero-core" data-visible={inView ? "" : undefined}>
      <div className="hero-core-reticle">
        <span className="hero-core-ring hero-core-ring-1" />
        <span className="hero-core-ring hero-core-ring-2" />
        <span className="hero-core-ring hero-core-ring-3" />
        <span className="hero-core-ring hero-core-ring-4" />
        <span className="hero-core-axis" />
        <span className="hero-core-axis hero-core-axis-v" />
        <span className="hero-core-axis hero-core-axis-d1" />
        <span className="hero-core-axis hero-core-axis-d2" />
      </div>
      {Canvas ? <Canvas active={inView && allowMotion} still={reducedMotion} tilt={finePointer && allowMotion} /> : null}
      <span className="hero-core-emitter" />
      <span className="hero-core-dot" />
      <span className="hero-core-tick" />
    </div>
  );
}
