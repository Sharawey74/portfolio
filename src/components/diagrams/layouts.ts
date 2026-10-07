/**
 * Presentation only: where each flow node sits. Which nodes and steps exist is
 * a claim and lives (with sources) in projects.ts → flow. A node missing here
 * fails at build time, so a diagram can never draw a component the data lacks.
 */
export type Layout = { width: number; height: number; box: { w: number; h: number }; at: Record<string, [number, number]> };

export const layouts: Record<string, Layout> = {
  eventora: {
    width: 960,
    height: 420,
    box: { w: 168, h: 60 },
    at: { client: [110, 210], api: [420, 210], redis: [800, 96], postgres: [800, 324] },
  },
  "recruiter-pro": {
    width: 1060,
    height: 300,
    box: { w: 140, h: 60 },
    at: { client: [90, 150], api: [266, 150], parse: [442, 150], extract: [618, 150], score: [794, 150], explain: [970, 150] },
  },
  sysplex: {
    width: 960,
    height: 420,
    box: { w: 160, h: 60 },
    at: { go: [110, 90], bash: [110, 210], ps: [110, 330], server: [500, 210], dashboard: [850, 210] },
  },
};

/** Point where the segment from box center (cx, cy) toward (tx, ty) leaves the box. */
export function exitPoint(cx: number, cy: number, tx: number, ty: number, w: number, h: number): [number, number] {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return [cx, cy];
  const sx = dx === 0 ? Infinity : w / 2 / Math.abs(dx);
  const sy = dy === 0 ? Infinity : h / 2 / Math.abs(dy);
  const s = Math.min(sx, sy);
  return [cx + dx * s, cy + dy * s];
}
