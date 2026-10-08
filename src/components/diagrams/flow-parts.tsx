import type { Project } from "@/data/projects.ts";
import { zoneRect, type Layout } from "./layouts.ts";

type Flow = NonNullable<Project["flow"]>;

/**
 * Pieces shared by the animated diagram (M9) and the card preview, so both
 * draw the same picture. Zones are sourced groupings from `flow.zones` (e.g.
 * "runs natively on the host"): a dashed frame on a raised fill with a mono
 * label, drawn behind the nodes.
 */
export function FlowZones({ flow, layout }: { flow: Flow; layout: Layout }) {
  return (
    <g>
      {flow.zones.map((z) => {
        const r = zoneRect(layout, z.nodes);
        return (
          <g key={z.label}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="2" className="flow-zone" />
            <text x={r.x + 16} y={r.y + 24} className="flow-zone-label">
              {z.label}
            </text>
            <text x={r.x + 16} y={r.y + 42} className="flow-zone-note">
              {z.note}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Node name, plus its detail line when the layout's boxes have room for it. */
export function NodeText({ cx, cy, label, detail, layout }: { cx: number; cy: number; label: string; detail: string; layout: Layout }) {
  if (!layout.detail) {
    return (
      <text x={cx} y={cy + 5} textAnchor="middle" className="flow-label">
        {label}
      </text>
    );
  }
  return (
    <>
      <text x={cx} y={cy - 4} textAnchor="middle" className="flow-label">
        {label}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" className="flow-detail">
        {detail}
      </text>
    </>
  );
}
