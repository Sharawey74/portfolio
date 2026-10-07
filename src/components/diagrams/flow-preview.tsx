import type { Project } from "@/data/projects.ts";
import { exitPoint, layouts } from "./layouts.ts";

type Flow = NonNullable<Project["flow"]>;

/**
 * Static, server-rendered thumbnail of a project's flow for the home-page card
 * (projects without screenshots). Same sourced nodes and edges as the full
 * animated diagram on the case study; decorative here, so aria-hidden.
 */
export function FlowPreview({ slug, flow }: { slug: string; flow: Flow }) {
  const layout = layouts[slug];
  if (!layout) return null;
  const { w, h } = layout.box;
  const pairs = new Map<string, [string, string]>();
  for (const s of flow.steps) pairs.set([s.from, s.to].sort().join("|"), [s.from, s.to]);

  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" focusable="false" className="block h-auto w-full">
      {[...pairs.values()].map(([a, b]) => {
        const [ax, ay] = layout.at[a]!;
        const [bx, by] = layout.at[b]!;
        const [x1, y1] = exitPoint(ax, ay, bx, by, w, h);
        const [x2, y2] = exitPoint(bx, by, ax, ay, w, h);
        return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-3)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />;
      })}
      {flow.nodes.map((n) => {
        const [cx, cy] = layout.at[n.id]!;
        return (
          <g key={n.id}>
            <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="2" className="flow-box-face" />
            <text x={cx} y={cy + 5} textAnchor="middle" className="flow-label">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
