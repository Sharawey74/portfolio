/**
 * The hero's node field (M4): pure geometry shared by the static SVG (server)
 * and the canvas (client). Deterministic from a seed, so the SVG fallback and
 * the first canvas frame show the same graph.
 */

export type Node = { x: number; y: number; vx: number; vy: number };
export type Edge = [number, number, number]; // a, b, strength 0..1

/** mulberry32: small, fast, deterministic. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SEED = 74;
export const LINK_DISTANCE = 170;

/** Jittered grid placement: even coverage without visible rows. */
export function createNodes(count: number, width: number, height: number, seed = SEED): Node[] {
  const rand = rng(seed);
  const cols = Math.max(1, Math.round(Math.sqrt((count * width) / height)));
  const rows = Math.max(1, Math.ceil(count / cols));
  const cw = width / cols;
  const ch = height / rows;
  const nodes: Node[] = [];
  for (let i = 0; i < count; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    nodes.push({
      x: (c + 0.15 + rand() * 0.7) * cw,
      y: (r + 0.15 + rand() * 0.7) * ch,
      vx: (rand() - 0.5) * 0.012,
      vy: (rand() - 0.5) * 0.012,
    });
  }
  return nodes;
}

/** Edges between nodes closer than `distance`; strength fades with length. */
export function edgesOf(nodes: Node[], distance = LINK_DISTANCE): Edge[] {
  const out: Edge[] = [];
  const d2max = distance * distance;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]!;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < d2max) out.push([i, j, 1 - Math.sqrt(d2) / distance]);
    }
  }
  return out;
}
