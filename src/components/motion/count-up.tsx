"use client";

import { useEffect, useRef } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";

const DURATION = 1200;

/**
 * M10. Renders `display` exactly as given (server HTML holds the final value).
 * After hydration, the first time it scrolls into view and motion is allowed,
 * the numeric part counts up from 0 in tabular figures, keeping prefix,
 * separators, decimals and suffix ("~4.5", "32,577", "84.1", "30+", "10/10").
 * Displays without a leading number stay static.
 */
export function CountUp({ display, className = "" }: { display: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { allowMotion } = useMotionPrefs();

  useEffect(() => {
    const el = ref.current;
    const m = display.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!el || !allowMotion || !m) return;
    const [, prefix, num, suffix] = m as unknown as [string, string, string, string];
    const target = Number(num.replaceAll(",", ""));
    const decimals = num.includes(".") ? num.split(".")[1]!.length : 0;
    const grouped = num.includes(",");
    const format = (v: number) =>
      prefix +
      v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped }) +
      suffix;

    let stop: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        let t = 0;
        el.textContent = format(0);
        stop = subscribe((_, dt) => {
          t = Math.min(1, t + dt / DURATION);
          const eased = 1 - (1 - t) ** 3;
          el.textContent = format(target * eased);
          if (t >= 1) {
            el.textContent = display;
            stop?.();
          }
        }, "input");
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      el.textContent = display;
    };
  }, [display, allowMotion]);

  return (
    <span ref={ref} className={`num ${className}`}>
      {display}
    </span>
  );
}
