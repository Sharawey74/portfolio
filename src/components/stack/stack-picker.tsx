"use client";

import { useEffect, useState, type ReactNode } from "react";

type LaneInfo = { id: string; name: string; projects: string[]; side: "l" | "r" };

/**
 * The Stack tree's lane nodes as toggle buttons (docs/ISSUES.md ISS-55).
 * Choosing a lane sets html[data-stack-lane] so the project timeline further
 * down lights the projects that use it (CSS only, nothing re-renders there),
 * and announces which projects those are. Pressing it again clears it.
 * Lanes sit in two columns, each lane on the side the server chose (the
 * shorter column so far), so the columns come out about even.
 * Lane content is server-rendered and passed in. The buttons sit over the
 * decorative nodes and render only under html[data-js] (.js-only): with JS
 * off the tree is a plain list.
 */
export function StackPicker({
  label,
  highlight,
  announce,
  cleared,
  lanes,
  units,
}: {
  label: string;
  highlight: string;
  announce: string;
  cleared: string;
  lanes: LaneInfo[];
  units: ReactNode[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (selected) html.dataset.stackLane = selected;
    else delete html.dataset.stackLane;
    return () => {
      delete html.dataset.stackLane;
    };
  }, [selected]);

  const current = lanes.find((l) => l.id === selected);
  const message = current
    ? announce.replace("{lane}", current.name).replace("{projects}", current.projects.join(", "))
    : touched
      ? cleared
      : "";

  return (
    <div role="group" aria-label={label} className="tree">
      <span className="tree-rail" aria-hidden="true" />
      {(["l", "r"] as const).map((side) => (
        <div key={side} className="tree-col" data-side={side}>
          {lanes.map((l, i) =>
            l.side !== side ? null : (
              <div key={l.id} className="tree-unit" data-side={side} data-selected={selected === l.id ? "" : undefined}>
                {/* Not aria-hidden: it holds the button. Empty otherwise. */}
                <span className="tree-node" data-node="">
                  <button
                    type="button"
                    aria-pressed={selected === l.id}
                    aria-label={highlight.replace("{lane}", l.name)}
                    onClick={() => {
                      setTouched(true);
                      setSelected((s) => (s === l.id ? null : l.id));
                    }}
                    className="tree-node-button js-only"
                  />
                </span>
                <div className="tree-txt">{units[i]}</div>
              </div>
            ),
          )}
        </div>
      ))}
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
