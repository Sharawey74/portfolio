"use client";

import { useEffect, useRef } from "react";
import { SplitWords } from "@/lib/text/split-words.tsx";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";

const BASE = 300;
const PEAK = 460;
const RADIUS = 280;
const EASE = 0.18;

/**
 * The hero H1 (M3). Words blur into focus and rise on load (CSS, see
 * .hero-h1 .w-i), in gradient text with the --break period (Stage 7), and on
 * desktop with a fine pointer each word's Newsreader weight follows cursor
 * proximity.
 *
 * Weight changes glyph widths, so while the effect is active every word is
 * pinned to its measured width at the base weight: the line never reflows and
 * nothing shifts (CLS stays 0). Off for coarse pointers, reduced motion and
 * the global pause.
 */
export function HeroHeadline({ text, id }: { text: string; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { finePointer, allowMotion } = useMotionPrefs();
  const enabled = finePointer && allowMotion;

  useEffect(() => {
    const h1 = ref.current;
    if (!enabled || !h1) return;
    const words = [...h1.querySelectorAll<HTMLElement>(".w")];
    const weights = words.map(() => BASE);
    const targets = words.map(() => BASE);
    let stop: (() => void) | null = null;

    const pin = () => {
      for (const w of words) {
        w.style.width = "";
        w.style.fontWeight = "";
      }
      for (const w of words) w.style.width = `${w.getBoundingClientRect().width}px`;
    };
    document.fonts.ready.then(pin).catch(pin);
    const ro = new ResizeObserver(pin);
    ro.observe(h1);

    const frame = () => {
      let settled = true;
      words.forEach((w, i) => {
        const next = weights[i]! + (targets[i]! - weights[i]!) * EASE;
        if (Math.abs(next - targets[i]!) > 0.5) settled = false;
        weights[i] = next;
        w.style.fontWeight = String(Math.round(next));
      });
      if (settled) {
        stop?.();
        stop = null;
      }
    };
    const run = () => {
      if (!stop) stop = subscribe(frame, "input");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      words.forEach((w, i) => {
        const r = w.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        targets[i] = BASE + (PEAK - BASE) * Math.max(0, 1 - d / RADIUS) ** 2;
      });
      run();
    };
    const onLeave = () => {
      targets.fill(BASE);
      run();
    };

    const host = h1.closest("section") ?? h1;
    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      stop?.();
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
      for (const w of words) {
        w.style.width = "";
        w.style.fontWeight = "";
      }
    };
  }, [enabled]);

  return (
    <h1 ref={ref} id={id} className="rv-load hero-h1 text-gradient font-display text-display-xl font-light">
      <SplitWords text={text.replace(/\.$/, "")} trailing={<span className="accent-mark text-break">.</span>} />
    </h1>
  );
}
