"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { SplitWords } from "@/lib/text/split-words.tsx";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";
import { DUR_MS } from "@/lib/motion/tokens.ts";

/** Newsreader axes: weight 300 at rest, the lens peaks at 480; optical size
 * 72 (display cut) at rest, 18 (text cut: sturdier, wider) under the lens. */
const W_REST = 300;
const W_PEAK = 480;
const O_REST = 72;
const O_PEAK = 18;
const RADIUS = 220;
const EASE = 0.18;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·";

/**
 * The hero H1 (M3, ISS-50).
 * - Opening (CSS, once per load): the letters rise and blur into focus one by
 *   one, the --break period lands last with one pulse (see .hero-h1 .ch and
 *   .accent-mark in globals.css); here, the label above decodes from mono noise.
 * - Optical lens (fine pointer, motion allowed): letters near the cursor move
 *   along Newsreader's weight and optical-size axes, like a lens passing over
 *   the name. Each word is pinned to its rest width, so lines never reflow.
 * - Cursor light: each letter's gradient brightens toward the pointer
 *   (`data-lit` with `--lx` / `--ly` per letter; the gradient is per letter
 *   because Chrome breaks a parent's clipped-text background while children
 *   animate).
 * Off for coarse pointers, reduced motion and the global pause; letter centres
 * are cached and re-measured only on resize, so pointer moves read no layout.
 */
export function HeroHeadline({ text, id }: { text: string; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { finePointer, allowMotion } = useMotionPrefs();
  const enabled = finePointer && allowMotion;

  // Label decode, once, when the opening plays (not under the M1 intro).
  // Motion reads as off until hydration, so wait for it, then run once.
  const decoded = useRef(false);
  useEffect(() => {
    const root = document.documentElement;
    if (decoded.current || !allowMotion || root.dataset.reveal !== "on" || root.dataset.intro) return;
    decoded.current = true;
    const el = ref.current?.parentElement?.querySelector<HTMLElement>(".hero-label [data-scramble]");
    const target = el?.dataset.scramble;
    if (!el || !target) return;
    let t = 0;
    const stop = subscribe((_, dt) => {
      t += dt;
      const p = Math.min(1, t / DUR_MS.slow);
      const settled = Math.floor(p * target.length);
      let out = target.slice(0, settled);
      for (let i = settled; i < target.length; i++) out += target[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (p >= 1) {
        el.textContent = target;
        stop();
      }
    }, "input");
    return () => {
      stop();
      el.textContent = target;
    };
  }, [allowMotion]);

  useEffect(() => {
    const h1 = ref.current;
    if (!enabled || !h1) return;
    const words = [...h1.querySelectorAll<HTMLElement>(".w")];
    const letters = [...h1.querySelectorAll<HTMLElement>(".ch")];
    const centers = letters.map(() => ({ x: 0, y: 0 }));
    const boxes = letters.map(() => ({ x: 0, y: 0 }));
    const amount = letters.map(() => 0);
    const target = letters.map(() => 0);
    const light = letters.map(() => ({ x: 0, y: 0 }));
    const lightTarget = letters.map(() => ({ x: 0, y: 0 }));
    let stop: (() => void) | null = null;

    const measure = () => {
      for (const w of words) w.style.width = "";
      for (const l of letters) l.style.fontVariationSettings = "";
      const h = h1.getBoundingClientRect();
      for (const w of words) w.style.width = `${w.getBoundingClientRect().width}px`;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        centers[i] = { x: r.left - h.left + r.width / 2, y: r.top - h.top + r.height / 2 };
        boxes[i] = { x: r.left - h.left, y: r.top - h.top };
      });
    };
    document.fonts.ready.then(measure).catch(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(h1);

    const frame = () => {
      let settled = true;
      letters.forEach((l, i) => {
        const next = amount[i]! + (target[i]! - amount[i]!) * EASE;
        if (Math.abs(next - target[i]!) > 0.004) settled = false;
        amount[i] = next;
        const k = next;
        l.style.fontVariationSettings = k < 0.004 ? "" : `"wght" ${(W_REST + (W_PEAK - W_REST) * k).toFixed(0)}, "opsz" ${(O_REST + (O_PEAK - O_REST) * k).toFixed(1)}`;
      });
      letters.forEach((w, i) => {
        const L = light[i]!;
        const T = lightTarget[i]!;
        L.x += (T.x - L.x) * EASE;
        L.y += (T.y - L.y) * EASE;
        if (Math.abs(T.x - L.x) > 0.5 || Math.abs(T.y - L.y) > 0.5) settled = false;
        w.style.setProperty("--lx", `${L.x.toFixed(1)}px`);
        w.style.setProperty("--ly", `${L.y.toFixed(1)}px`);
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
      // Positions are cached relative to the H1; the H1 itself can move (the
      // hero centres its content), so read its box on each move.
      const h = h1.getBoundingClientRect();
      const px = e.clientX - h.left;
      const py = e.clientY - h.top;
      letters.forEach((_, i) => {
        const d = Math.hypot(px - centers[i]!.x, py - centers[i]!.y);
        target[i] = Math.max(0, 1 - d / RADIUS) ** 2;
      });
      letters.forEach((_, i) => {
        lightTarget[i] = { x: px - boxes[i]!.x, y: py - boxes[i]!.y };
      });
      h1.dataset.lit = "";
      run();
    };
    const onLeave = () => {
      target.fill(0);
      delete h1.dataset.lit;
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
      delete h1.dataset.lit;
      for (const w of words) w.style.width = "";
      for (const l of letters) l.style.fontVariationSettings = "";
    };
  }, [enabled]);

  return (
    <h1
      ref={ref}
      id={id}
      className="rv-load hero-h1 text-gradient font-display text-display-xl font-light"
      style={{ "--letters": text.replace(/[\s.]/g, "").length } as CSSProperties}
    >
      <SplitWords text={text.replace(/\.$/, "")} letters trailing={<span className="accent-mark text-break">.</span>} />
    </h1>
  );
}
