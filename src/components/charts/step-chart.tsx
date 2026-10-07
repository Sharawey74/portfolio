import type { Project } from "@/data/projects.ts";

type Chart = Extract<Project["charts"][number], { kind: "steps" }>;

const W = 640;
const H = 300;
const M = { top: 20, right: 24, bottom: 52, left: 56 };

/**
 * M9d schedule chart: the k6 stage targets as a 2 px line with vertex markers
 * (native <title> tooltips), one y-axis, recessive grid. Whole-run outcomes
 * sit beside it as figures, the highlighted one marked with a --break square
 * (the value text stays ink). An sr-only table carries the same points.
 */
export function StepChart({ chart }: { chart: Chart }) {
  const xMax = Math.max(...chart.points.map(([x]) => x));
  const yTop = Math.max(...chart.points.map(([, y]) => y));
  const yMax = Math.ceil(yTop / 50) * 50;
  const yTicks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);
  const xTicks = Array.from({ length: Math.floor(xMax / 2) + 1 }, (_, i) => i * 2);
  const px = (v: number) => M.left + (v / xMax) * (W - M.left - M.right);
  const py = (v: number) => H - M.bottom - (v / yMax) * (H - M.top - M.bottom);
  const d = chart.points.map(([x, y], i) => `${i ? "L" : "M"}${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(" ");

  return (
    <div className="grid items-end gap-8 md:grid-cols-[2fr_1fr]">
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="chart block h-auto w-full" role="img" aria-label={chart.caption}>
          <g className="chart-grid">
            {yTicks.map((t) => (
              <line key={t} x1={M.left} x2={W - M.right} y1={py(t)} y2={py(t)} />
            ))}
          </g>
          <g className="chart-axis-text">
            {yTicks.map((t) => (
              <text key={t} x={M.left - 10} y={py(t) + 4} textAnchor="end">
                {t}
              </text>
            ))}
            {xTicks.map((t) => (
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
          <path d={d} className="chart-line" />
          {chart.points.map(([x, y]) => (
            <g key={`${x}-${y}`} className="chart-point">
              <title>{`${x} min: ${y} target VUs`}</title>
              <circle cx={px(x)} cy={py(y)} r="12" className="chart-hit" />
              <circle cx={px(x)} cy={py(y)} r="4" className="chart-vertex" />
              {y === yTop ? (
                <text x={px(x)} y={py(y) - 12} textAnchor="middle" className="chart-value">
                  {y}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
        <table className="sr-only">
          <caption>{chart.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{chart.xLabel}</th>
              <th scope="col">{chart.yLabel}</th>
            </tr>
          </thead>
          <tbody>
            {chart.points.map(([x, y]) => (
              <tr key={`${x}-${y}`}>
                <td>{x}</td>
                <td>{y}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="flex flex-col gap-5">
        {chart.outcomes.map((o) => (
          <div key={o.label} className="border-t border-hair pt-3">
            <dt className="mono-label text-ink-3">{o.label}</dt>
            <dd className="num flex items-center gap-2 font-display text-h2">
              {o.highlight ? <span aria-hidden="true" className="inline-block size-2 bg-break" /> : null}
              {o.display}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
