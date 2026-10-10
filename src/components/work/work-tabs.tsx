"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Project tabs (Stage 7, replaces the M6 sticky stack). One featured project
 * shows at a time; the pills select it, and arrow keys, Home and End move
 * between tabs (automatic activation, roving tabindex). The tablist and the
 * hiding of inactive panels apply only under html[data-js] (set before first
 * paint), so with JS off every project renders, stacked, and server HTML
 * matches the first client render (no layout shift on hydration).
 */
export function WorkTabs({
  label,
  tabs,
  panels,
}: {
  label: string;
  tabs: { id: string; label: string }[];
  panels: ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const to =
      e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
    if (to === null) return;
    e.preventDefault();
    pick(to);
  };

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label={label} className="pill-group work-tablist self-start">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className="pill-option"
          >
            {t.label}
          </button>
        ))}
      </div>
      {panels.map((p, i) => (
        <div
          key={tabs[i]!.id}
          role="tabpanel"
          id={`panel-${tabs[i]!.id}`}
          aria-labelledby={`tab-${tabs[i]!.id}`}
          data-active={i === active ? "" : undefined}
          className="work-panel"
        >
          {p}
        </div>
      ))}
    </div>
  );
}
