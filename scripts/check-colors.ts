/**
 * One-color check. Run: node scripts/check-colors.ts
 *
 * The site's only non-gray colors are the accent ramp: --c1, --c2 and --break
 * (owner decision 2026-10-08, docs/ISSUES.md ISS-21), plus the two translucent
 * edge colors --edge and --edge-soft (Stage 7, ISS-42). This scans
 *   - every .css and .svg file under src/ and public/
 *   - whole-string color literals ("#ff0000", 'rgb(...)') and SVG paint
 *     attributes in .ts / .tsx under src/
 *   - the built CSS in .next/static when a build exists
 * and fails on any color that is not neutral (R=G=B, zero chroma), except the
 * ramp's and the edges' definitions in globals.css and their compiled copies.
 * Raster images (screenshots) are not scanned.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const css = readFileSync(join(root, "src/styles/globals.css"), "utf8");
const ACCENT_DECL = /--(break|c1|c2):\s*#/;
// The compiler rewrites the edges' rgba() as 8-digit hex in the built CSS.
const EDGE_DECL = /--(edge|edge-soft):\s*rgba\($/;
const EDGE_HEX_DECL = /--(edge|edge-soft):\s*$/;
const BREAK_VALUES = new Set(
  [...css.matchAll(/--(?:break|c1|c2):\s*(#[0-9a-f]{6})/gi)].map((m) => m[1]!.toLowerCase()),
);

const errors: string[] = [];

function expandHex(h: string): string {
  const x = h.slice(1).toLowerCase();
  if (x.length === 3 || x.length === 4) return [...x.slice(0, 3)].map((c) => c + c).join("");
  return x.slice(0, 6);
}
const neutralHex = (h: string) => {
  const x = expandHex(h);
  return x.slice(0, 2) === x.slice(2, 4) && x.slice(2, 4) === x.slice(4, 6);
};

function neutralFn(fn: string, args: string): boolean {
  const parts = args.split(/[\s,/]+/).filter(Boolean);
  const f = fn.toLowerCase();
  if (f === "rgb" || f === "rgba") return parts[0] === parts[1] && parts[1] === parts[2];
  if (f === "hsl" || f === "hsla") return /^0(%|\.0+%?)?$/.test(parts[1] ?? "");
  if (f === "oklch" || f === "lch") return Number.parseFloat(parts[1] ?? "1") === 0;
  if (f === "oklab" || f === "lab") return Number.parseFloat(parts[1] ?? "1") === 0 && Number.parseFloat(parts[2] ?? "1") === 0;
  return false; // color(), hwb(): not used here, flag for review
}

const NAMED = /(?<![\w-])(red|blue|green|yellow|orange|purple|pink|cyan|magenta|teal|navy|lime|maroon|olive|aqua|fuchsia|indigo|violet|crimson|gold|coral|salmon|tomato)(?![\w-])/i;

function scanCss(text: string, rel: string, allowBreakDecl: boolean) {
  // @supports conditions are feature tests, not painted colors (Tailwind's
  // preflight probes `color: rgb(from red r g b)`). Drop the condition text.
  const lines = text.replace(/@supports[^{]*\{/g, "@supports {").split(/\r?\n/);
  lines.forEach((line, i) => {
    const code = line.replace(/\/\*.*?\*\//g, "");
    for (const m of code.matchAll(/#[0-9a-f]{3,8}(?![0-9a-z_-])/gi)) {
      const hex = m[0];
      if (![4, 5, 7, 9].includes(hex.length) || neutralHex(hex)) continue;
      const isBreak = allowBreakDecl && ACCENT_DECL.test(code.slice(0, m.index! + 1)) && BREAK_VALUES.has(hex.toLowerCase());
      const isEdge = allowBreakDecl && hex.length === 9 && EDGE_HEX_DECL.test(code.slice(0, m.index!));
      if (!isBreak && !isEdge) errors.push(`${rel}:${i + 1} non-gray ${hex}`);
    }
    for (const m of code.matchAll(/\b(rgba?|hsla?|oklch|oklab|lch|lab|hwb|color)\(([^()]*)\)/gi)) {
      if (neutralFn(m[1]!, m[2]!)) continue;
      const isEdge = allowBreakDecl && EDGE_DECL.test(code.slice(0, m.index! + m[1]!.length + 1));
      if (!isEdge) errors.push(`${rel}:${i + 1} non-gray ${m[0]}`);
    }
    const valuePart = code.includes(":") ? code.slice(code.indexOf(":") + 1) : "";
    const named = valuePart.match(NAMED);
    if (named && !/^\s*--/.test(code)) errors.push(`${rel}:${i + 1} named color "${named[1]}"`);
  });
}

function scanTs(text: string, rel: string) {
  text.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/(["'`])(#[0-9a-f]{3,8})\1/gi)) {
      if ([4, 5, 7, 9].includes(m[2]!.length) && !neutralHex(m[2]!)) errors.push(`${rel}:${i + 1} non-gray ${m[2]}`);
    }
    for (const m of line.matchAll(/(["'`])((rgba?|hsla?|oklch|oklab|lch|lab)\(([^()]*)\))\1/gi)) {
      if (!neutralFn(m[3]!, m[4]!)) errors.push(`${rel}:${i + 1} non-gray ${m[2]}`);
    }
    for (const m of line.matchAll(/\b(fill|stroke|stopColor|color)=["{]["']?(#[0-9a-f]{3,8})/gi)) {
      if (!neutralHex(m[2]!)) errors.push(`${rel}:${i + 1} non-gray ${m[2]}`);
    }
  });
}

function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let files = 0;
for (const base of ["src", "public"]) {
  for (const f of walk(join(root, base))) {
    const rel = relative(root, f).replaceAll("\\", "/");
    const ext = extname(f);
    if (ext === ".css" || ext === ".svg") {
      scanCss(readFileSync(f, "utf8"), rel, rel === "src/styles/globals.css");
      files++;
    } else if (ext === ".ts" || ext === ".tsx") {
      scanTs(readFileSync(f, "utf8"), rel);
      files++;
    }
  }
}

let built = 0;
for (const f of walk(join(root, ".next/static"))) {
  if (extname(f) !== ".css") continue;
  scanCss(readFileSync(f, "utf8").replace(/}/g, "}\n").replace(/;/g, ";\n"), relative(root, f).replaceAll("\\", "/"), true);
  built++;
}

if (errors.length) {
  console.error(`color check: ${errors.length} problem(s)\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(
  `color check: ok (${files} source files, ${built} built CSS files; non-gray values: ${[...BREAK_VALUES].join(", ")} as --c1, --c2, --break, plus the --edge and --edge-soft lines)`,
);
