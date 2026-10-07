"use client";

import { useEffect, useState } from "react";

export type SpyItem = { id: string; index: string; title: string };

/**
 * M13 scroll-spy. One IntersectionObserver over the target sections marks the
 * last section whose top has passed 45% of the viewport as current: the link gets
 * aria-current="true", and the --break marker dot (an allowed break use) plus
 * full ink weight. The state is never conveyed by color alone.
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
    const io = new IntersectionObserver(pick, { rootMargin: "0px 0px -55% 0px" });
    for (const t of targets) io.observe(t);
    return () => io.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className="spy-nav" data-layout={layout} data-lenis-prevent>
      <ul>
        {items.map((item) => {
          const active = item.id === current;
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={active ? "true" : undefined} className="spy-link mono-label">
                <span aria-hidden="true" className="spy-dot" />
                <span className="num spy-index">{item.index}</span>
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
