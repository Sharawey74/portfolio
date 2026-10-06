"use client";

import { useEffect, useRef, useState } from "react";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { useInView } from "@/lib/motion/use-in-view.ts";

/**
 * Exercises the motion kernel on the specimen page: a "loop" task that runs
 * only in view, stops on hidden tab, and stops under the global pause or
 * reduced motion. The bar moves at a constant rate (linear is correct here).
 */
export function KernelDemo() {
  const box = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const prefs = useMotionPrefs();
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    if (!inView || !prefs.allowMotion) return;
    let x = 0;
    let n = 0;
    return subscribe((_, delta) => {
      x = (x + delta / 4000) % 1;
      bar.current?.style.setProperty("scale", `${x} 1`);
      if (++n % 30 === 0) setFrames(n);
    }, "loop");
  }, [inView, prefs.allowMotion]);

  return (
    <div ref={box} className="flex flex-col gap-3">
      <div className="h-px w-full bg-hair">
        <div ref={bar} className="h-px w-full origin-left bg-ink" style={{ scale: "0 1" }} />
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-mono text-ink-2 md:grid-cols-6">
        {(
          [
            ["in view", inView],
            ["reduced motion", prefs.reducedMotion],
            ["fine pointer", prefs.finePointer],
            ["save-data", prefs.saveData],
            ["paused", prefs.paused],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-3">{k}</dt>
            <dd>{v ? "yes" : "no"}</dd>
          </div>
        ))}
        <dt className="text-ink-3">frames</dt>
        <dd className="num">{frames}</dd>
      </dl>
    </div>
  );
}
