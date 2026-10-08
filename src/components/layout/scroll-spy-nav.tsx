"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrambleText } from "@/components/motion/scramble.tsx";

export type SpyItem = { id: string; index: string; title: string };

/**
 * M13 scroll-spy. One IntersectionObserver over the target sections marks the
 * last section whose top has passed 45% of the viewport as current: the link gets
 * aria-current="true", the --break marker dot, full ink and a --c1 pill. The
 * state is never conveyed by color alone.
 *
 * Native `scroll-target-group` + `:target-current` is Chromium-only (2026), so
 * the observer is the single mechanism everywhere.
 */
export function ScrollSpyNav({
  items,
  label,
  layout = "row",
}: {
  items: SpyItem[];
  label: string;
  layout?: "row" | "column";
}) {
  const [current, setCurrent] = useState<string | null>(null);
  // The header nav also renders on case-study pages, where the sections live
  // on "/": link there instead of to an anchor this page does not have.
  const base = usePathname() === "/" ? "" : "/";

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    // Current = the last target (document order) whose top has passed the
    // reading line at 45% of the viewport. The observer's root band ends at
    // that line, so it fires exactly when a target crosses it; the order of
    // targets cannot change between callbacks.
    const pick = () => {
      const line = window.innerHeight * 0.45;
      let id: string | null = null;
      for (const t of targets) if (t.getBoundingClientRect().top <= line) id = t.id;
      setCurrent(id);
    };
    // The band observer alone misses jumps (hash links, scroll restoration,
    // "Back to top"): a heading can go from above the band to below it with no
    // crossing, leaving the old section current (docs/ISSUES.md ISS-34). A
    // second observer over the whole viewport fires on any jump, because what
    // was on screen before it leaves the screen.
    const band = new IntersectionObserver(pick, { rootMargin: "0px 0px -55% 0px" });
    const screen = new IntersectionObserver(pick);
    for (const t of targets) {
      band.observe(t);
      screen.observe(t);
    }
    window.addEventListener("hashchange", pick);
    window.addEventListener("pageshow", pick);
    return () => {
      band.disconnect();
      screen.disconnect();
      window.removeEventListener("hashchange", pick);
      window.removeEventListener("pageshow", pick);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className="spy-nav" data-layout={layout} data-lenis-prevent>
      <ul>
        {items.map((item) => {
          const active = item.id === current;
          return (
            <li key={item.id}>
              <a href={`${base}#${item.id}`} aria-current={active ? "true" : undefined} className="spy-link ui-label">
                <span aria-hidden="true" className="spy-dot" />
                <span className="num spy-index font-mono text-mono">{item.index}</span>
                <ScrambleText text={item.title} />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
