"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { subscribe } from "@/lib/motion/scheduler.ts";

/** Holds the live Lenis instance outside React state. */
function createLenisStore() {
  let current: Lenis | null = null;
  const listeners = new Set<() => void>();
  return {
    get: () => current,
    set(next: Lenis | null) {
      current = next;
      for (const l of listeners) l();
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}
type LenisStore = ReturnType<typeof createLenisStore>;

const LenisContext = createContext<LenisStore | null>(null);

/** The Lenis instance, or null under reduced motion (native scrolling). */
export function useLenis(): Lenis | null {
  const store = useContext(LenisContext);
  return useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    () => store?.get() ?? null,
    () => null,
  );
}

const SUPPORTS_SCROLL_TIMELINE =
  typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()");

/**
 * M2. Lenis smooth scrolling, driven by the shared scheduler (no second rAF
 * loop). Off under reduced motion. Anchor links glide; inner scrollers opt out
 * with `data-lenis-prevent`. Also renders the scroll-progress hairline: CSS
 * scroll timeline where supported, otherwise Lenis' scroll callback writes
 * --progress (never a scroll event listener).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { reducedMotion } = useMotionPrefs();
  const [store] = useState(createLenisStore);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const instance = new Lenis({ autoRaf: false, anchors: { offset: -64 }, lerp: 0.12 });
    const unsubscribe = subscribe((time) => instance.raf(time), "input");
    if (!SUPPORTS_SCROLL_TIMELINE) {
      instance.on("scroll", ({ progress }: Lenis) => {
        bar.current?.style.setProperty("--progress", String(progress));
      });
    }
    store.set(instance);
    return () => {
      unsubscribe();
      instance.destroy();
      store.set(null);
    };
  }, [reducedMotion, store]);

  return (
    <LenisContext.Provider value={store}>
      <div ref={bar} className="scroll-progress" aria-hidden="true" />
      {children}
    </LenisContext.Provider>
  );
}
