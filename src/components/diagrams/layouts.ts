/**
 * Presentation only: where each flow node sits. Which nodes and steps exist is
 * a claim and lives (with sources) in projects.ts → flow. A node missing here
 * fails at build time, so a diagram can never draw a component the data lacks.
 */
export type Layout = {
  width: number;
  height: number;
  box: { w: number; h: number };
  at: Record<string, [number, number]>;
  /** Boxes tall enough for the node's detail line under its name. */
  detail?: boolean;
};

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
  // Two tiers as in the README: collection on the host (left), presentation
  // in Docker (right); the server feeds the dashboard inside its tier.
  sysplex: {
    width: 960,
    height: 470,
    box: { w: 236, h: 72 },
    detail: true,
    at: { go: [170, 150], bash: [170, 270], ps: [170, 390], server: [770, 190], dashboard: [770, 350] },
  },
};

/** Frame around a zone's nodes, with room above them for the zone's label and note. */
export function zoneRect(layout: Layout, ids: string[], pad = 24, labelRoom = 40) {
  const { w, h } = layout.box;
  const pts = ids.map((id) => layout.at[id]!);
  const x = Math.min(...pts.map(([cx]) => cx - w / 2)) - pad;
  const y = Math.min(...pts.map(([, cy]) => cy - h / 2)) - pad - labelRoom;
  const right = Math.max(...pts.map(([cx]) => cx + w / 2)) + pad;
  const bottom = Math.max(...pts.map(([, cy]) => cy + h / 2)) + pad;
  return { x, y, w: right - x, h: bottom - y };
}

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
