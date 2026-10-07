/**
 * Contrast check. Run: node scripts/check-contrast.ts
 *
 * Parses the primitive token blocks in src/styles/globals.css (between
 * `tokens:<name>` and `tokens:end` markers) and checks every pairing the
 * design actually uses, in both themes, against WCAG 2.2 ratios:
 *   text roles on surfaces         >= 4.5   (1.4.3)
 *   --break as text (H1 period)    >= 4.5
 *   --break as graphics (ring, dot, active node) >= 3.0  (1.4.11)
 *   field underline (--g8)         >= 3.0
 * Also asserts the no-JS light block is identical to the scripted light block.
 * Exits 1 on any failure.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8");

type Tokens = Record<string, string>;

function block(name: string): Tokens {
  const m = css.match(new RegExp(`/\\* tokens:${name} \\*/([\\s\\S]*?)/\\* tokens:end \\*/`));
  if (!m?.[1]) throw new Error(`globals.css: block tokens:${name} not found`);
  const out: Tokens = {};
  for (const [, k, v] of m[1].matchAll(/--(g\d+|break):\s*(#[0-9a-f]{6})\s*;/gi)) {
    if (k && v) out[k] = v.toLowerCase();
  }
  return out;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0]! + 0.7152 * ch[1]! + 0.0722 * ch[2]!;
}

export function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const SURFACES = ["g0", "g1", "g2", "g3"];
type Pair = { fg: string; bg: string; min: number; use: string };

const pairs: Pair[] = [
  ...["g11", "g10", "g9", "g8"].flatMap((fg) =>
    SURFACES.map((bg) => ({ fg, bg, min: 4.5, use: "text role on surface" })),
  ),
  ...["g0", "g1", "g2"].map((bg) => ({ fg: "break", bg, min: 4.5, use: "break as text (H1 period)" })),
  ...SURFACES.map((bg) => ({ fg: "break", bg, min: 3, use: "break as graphics (focus ring, dot, node)" })),
  ...SURFACES.map((bg) => ({ fg: "g8", bg, min: 3, use: "field underline, diagram edges" })),
  { fg: "g0", bg: "break", min: 4.5, use: "::selection text" },
  { fg: "g0", bg: "g11", min: 4.5, use: "filled button / skip link" },
  { fg: "g0", bg: "g10", min: 4.5, use: "filled button hover" },
];

const themes: [string, Tokens][] = [
  ["dark", block("dark")],
  ["light", block("light")],
];
const errors: string[] = [];

const media = block("light-media");
if (JSON.stringify(media) !== JSON.stringify(themes[1]![1])) {
  errors.push("tokens:light-media differs from tokens:light; keep them identical");
}

for (const [name, t] of themes) {
  for (const key of [...Array.from({ length: 12 }, (_, i) => `g${i}`), "break"]) {
    const v = t[key];
    if (!v) errors.push(`${name}: --${key} missing`);
    else if (key !== "break" && !(v.slice(1, 3) === v.slice(3, 5) && v.slice(3, 5) === v.slice(5, 7))) {
      errors.push(`${name}: --${key} ${v} is not neutral (R=G=B)`);
    }
  }
  let worst = Infinity;
  for (const p of pairs) {
    const fg = t[p.fg];
    const bg = t[p.bg];
    if (!fg || !bg) continue;
    const r = ratio(fg, bg);
    worst = Math.min(worst, r / p.min);
    if (r < p.min) {
      errors.push(`${name}: --${p.fg} ${fg} on --${p.bg} ${bg} = ${r.toFixed(2)}:1 < ${p.min} (${p.use})`);
    }
  }
  const b = t.break!;
  console.log(
    `${name}: ${pairs.length} pairs; break on page ${ratio(b, t.g0!).toFixed(2)}:1, ` +
      `text-3 on hover ${ratio(t.g8!, t.g3!).toFixed(2)}:1, tightest margin ${worst.toFixed(2)}x`,
  );
}

if (errors.length) {
  console.error(`contrast check: ${errors.length} failure(s)\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("contrast check: ok");
