"use client";

import { useEffect } from "react";
import { getMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { DUR_MS } from "@/lib/motion/tokens.ts";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·→";
const DURATION_MS = DUR_MS.base;

/**
 * Mono label whose visible copy scrambles briefly (400 ms) on hover or focus of the
 * nearest link or button (M11). The real text is a separate sr-only span, so
 * assistive technology never reads the noise; the visible copy is aria-hidden.
 * Server-rendered; one ScrambleHost on the page does the work.
 */
export function ScrambleText({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-scramble={text}>
        {text}
      </span>
    </>
  );
}

/**
 * One delegated listener for every ScrambleText. Runs 400 ms on the shared
 * scheduler as an "input" task (user-triggered, so not stopped by the pause).
 * Mono glyphs share one advance width, so the label never changes size.
 * Off under reduced motion and on coarse pointers for hover (focus still runs).
 */
export function ScrambleHost() {
  useEffect(() => {
    const running = new WeakSet<Element>();

    const run = (el: HTMLElement) => {
      const text = el.dataset.scramble;
      if (!text || running.has(el)) return;
      running.add(el);
      let t = 0;
      let unsubscribe = () => {};
      unsubscribe = subscribe((_, dt) => {
        t += dt;
        const p = Math.min(1, t / DURATION_MS);
        const settled = Math.floor(p * text.length);
        let out = text.slice(0, settled);
        for (let i = settled; i < text.length; i++) {
          const c = text[i]!;
          out += c === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p >= 1) {
          el.textContent = text;
          running.delete(el);
          unsubscribe();
        }
      }, "input");
    };

    const start = (target: EventTarget | null, viaPointer: boolean) => {
      if (!(target instanceof Element)) return;
      const prefs = getMotionPrefs();
      if (prefs.reducedMotion || (viaPointer && !prefs.finePointer)) return;
      const host = target.closest("a, button");
      if (!host) return;
      host.querySelectorAll<HTMLElement>("[data-scramble]").forEach(run);
    };

    const onOver = (e: PointerEvent) => {
      const from = e.relatedTarget instanceof Node ? e.relatedTarget : null;
      const host = e.target instanceof Element ? e.target.closest("a, button") : null;
      if (host && from && host.contains(from)) return;
      start(e.target, true);
    };
    const onFocus = (e: FocusEvent) => start(e.target, false);

    document.addEventListener("pointerover", onOver);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);
  return null;
}
