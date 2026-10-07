import type { Project } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";

type Chart = Extract<Project["charts"][number], { kind: "points" }>;

const W = 640;
const H = 340;
const M = { top: 24, right: 32, bottom: 52, left: 64 };

/** "Nice" upper bound and ticks for a linear axis starting at 0. */
function ticks(max: number, count = 4): number[] {
  const raw = max / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => i * step);
}

/**
 * M9d operating-point chart: one marker per measured configuration on shared
 * throughput / p95 axes. Server-rendered SVG; one axis each way; thin marks;
 * direct labels; a native <title> tooltip per marker; an sr-only table. The
 * single highlighted point uses --break on the marker only (text stays ink).
 */
export function PointChart({ chart }: { chart: Chart }) {
  const xs = ticks(Math.max(...chart.points.map((p) => p.x)) * 1.12);
  const ys = ticks(Math.max(...chart.points.map((p) => p.y)) * 1.1);
  const xMax = xs.at(-1)!;
  const yMax = ys.at(-1)!;
  const px = (v: number) => M.left + (v / xMax) * (W - M.left - M.right);
  const py = (v: number) => H - M.bottom - (v / yMax) * (H - M.top - M.bottom);

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart block h-auto w-full" role="img" aria-label={chart.caption}>
        <g className="chart-grid">
          {ys.map((t) => (
            <line key={t} x1={M.left} x2={W - M.right} y1={py(t)} y2={py(t)} />
          ))}
        </g>
        <g className="chart-axis-text">
          {ys.map((t) => (
            <text key={t} x={M.left - 10} y={py(t) + 4} textAnchor="end">
              {t}
            </text>
          ))}
          {xs.map((t) => (
            <text key={t} x={px(t)} y={H - M.bottom + 20} textAnchor="middle">
              {t}
            </text>
          ))}
          <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" className="chart-axis-title">
            {chart.xLabel}
          </text>
          <text x={14} y={(M.top + H - M.bottom) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(M.top + H - M.bottom) / 2})`} className="chart-axis-title">
            {chart.yLabel}
          </text>
        </g>
        <line className="chart-baseline" x1={M.left} x2={W - M.right} y1={py(0)} y2={py(0)} />
        {chart.points.map((p) => {
          const x = px(p.x);
          const y = py(p.y);
          const labelLeft = x > W * 0.6;
          return (
            <g key={p.label} className="chart-point" data-highlight={p.highlight ? "" : undefined}>
              <title>{`${p.label}: ${p.display}. ${p.note}`}</title>
              <line className="chart-drop" x1={x} x2={x} y1={y} y2={py(0)} />
              <circle cx={x} cy={y} r="14" className="chart-hit" />
              <circle cx={x} cy={y} r="6" className="chart-marker" />
              <text x={labelLeft ? x - 14 : x + 14} y={y - 4} textAnchor={labelLeft ? "end" : "start"} className="chart-label">
                {p.label}
              </text>
              <text x={labelLeft ? x - 14 : x + 14} y={y + 14} textAnchor={labelLeft ? "end" : "start"} className="chart-value">
                {p.display}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>{chart.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{profile.ui.chartConfiguration}</th>
            <th scope="col">{chart.xLabel}</th>
            <th scope="col">{chart.yLabel}</th>
            <th scope="col">{profile.ui.chartNote}</th>
          </tr>
        </thead>
        <tbody>
          {chart.points.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>{p.x}</td>
              <td>{p.y}</td>
              <td>{p.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
