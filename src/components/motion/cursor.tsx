"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";

const INTERACTIVE = "a[href], button:not(:disabled), [data-cursor], [role='button']";
const FIELD = "input, textarea, select, [contenteditable='true']";
const MAGNET_PULL = 0.25;
const MAGNET_MAX = 8;

/**
 * M5. Dot plus trailing ring with mix-blend-mode: difference, so it inverts
 * cleanly on black and white. Fine pointer only and never under reduced
 * motion; the native cursor returns in form fields.
 *
 *   data-cursor="View"  ring grows and shows the label (aria-hidden; the
 *                       element keeps its own accessible name)
 *   data-magnetic       element leans toward the pointer, at most 8 px
 *
 * Hovering an interactive element switches the ring to the --break outline,
 * one of the allowed break uses. The ring loop runs on the shared scheduler
 * only until it settles.
 */
export function Cursor() {
  const { finePointer, reducedMotion } = useMotionPrefs();
  const enabled = finePointer && !reducedMotion;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"idle" | "hover" | "hidden">("hidden");

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    // Not `data-cursor`: that attribute is the per-element label, and the
    // hover lookup would match <html> and show its value (docs/ISSUES.md ISS-33).
    root.dataset.cursorActive = "";

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let stopLoop: (() => void) | null = null;
    let magnet: HTMLElement | null = null;

    const follow = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      ring.current?.style.setProperty("translate", `${pos.x}px ${pos.y}px`);
      if (Math.abs(target.x - pos.x) < 0.1 && Math.abs(target.y - pos.y) < 0.1) {
        stopLoop?.();
        stopLoop = null;
      }
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      dot.current?.style.setProperty("translate", `${e.clientX}px ${e.clientY}px`);
      if (!stopLoop) stopLoop = subscribe(follow, "input");

      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest(FIELD)) {
        setState("hidden");
        releaseMagnet();
        return;
      }
      const hit = el?.closest<HTMLElement>(INTERACTIVE) ?? null;
      setState(hit ? "hover" : "idle");
      setLabel(hit?.dataset.cursor ?? "");

      const m = el?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (e.clientX - (r.left + r.width / 2)) * MAGNET_PULL));
        const dy = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (e.clientY - (r.top + r.height / 2)) * MAGNET_PULL));
        m.style.translate = `${dx}px ${dy}px`;
      }
    };
    const onLeave = () => {
      setState("hidden");
      releaseMagnet();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      stopLoop?.();
      releaseMagnet();
      delete root.dataset.cursorActive;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" data-state={state} className="cursor">
      <div ref={ring} className="cursor-ring">
        {label ? <span className="cursor-label mono-label">{label}</span> : null}
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
