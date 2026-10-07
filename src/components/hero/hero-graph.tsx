"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";

type CanvasProps = { active: boolean };

/**
 * M4 host. Shows the server-rendered static graph (children) until the canvas
 * chunk has loaded, then crossfades to the canvas. The canvas is imported only
 * after the browser is idle, and never when motion is reduced or Save-Data is
 * on, so it costs nothing on first load.
 */
export function HeroGraph({ children }: { children: ReactNode }) {
  const { allowMotion, reducedMotion, saveData } = useMotionPrefs();
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host);
  const [Canvas, setCanvas] = useState<ComponentType<CanvasProps> | null>(null);
  const wanted = !reducedMotion && !saveData;

  useEffect(() => {
    if (!wanted || Canvas) return;
    let cancelled = false;
    const load = () =>
      import("./hero-canvas.tsx").then((m) => {
        if (!cancelled) setCanvas(() => m.default);
      });
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [wanted, Canvas]);

  const live = wanted && Canvas !== null;
  return (
    <div ref={host} data-live={live ? "" : undefined} className="hero-graph pointer-events-auto absolute inset-0">
      <div className="hero-graph-static absolute inset-0">{children}</div>
      {live ? <Canvas active={inView && allowMotion} /> : null}
    </div>
  );
}
