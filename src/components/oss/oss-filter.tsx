"use client";

import { useState, type ReactNode } from "react";

type State = "merged" | "open";
type Filter = "all" | State;

/**
 * Open source filter (Stage 7): All / Merged / Open, as pressed toggle pills
 * with counts. Rows are server-rendered and passed in with their state, so
 * this only chooses which to show; the count of shown rows is announced. The
 * pills render only under html[data-js] (.js-only): with JS off every row shows.
 */
export function OssFilter({
  label,
  labels,
  showing,
  of,
  states,
  rows,
}: {
  label: string;
  labels: Record<Filter, string>;
  showing: string;
  of: string;
  states: State[];
  rows: ReactNode[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const count = (f: Filter) => (f === "all" ? states.length : states.filter((s) => s === f).length);
  const shown = rows.filter((_, i) => filter === "all" || states[i] === filter);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={label} className="pill-group js-only self-start">
        {(["all", "merged", "open"] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="pill-option">
            {labels[f]} <span className="num font-mono text-mono opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filter === "all" ? "" : `${showing} ${shown.length} ${of} ${rows.length}`}
      </p>
      <ul className="surface-card overflow-clip">{shown}</ul>
    </div>
  );
}
