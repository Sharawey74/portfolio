/**
 * First-load JS report. Run after `next build`: npm run report:bundle
 *
 * Next 16 no longer prints first-load sizes, so this reads each prerendered
 * page's HTML, sums the gzipped size of every script it loads, and compares
 * `/` with the budget (170 KB gz). `nomodule` scripts (legacy polyfills) are
 * excluded: modern browsers never download them. Lazily imported chunks (hero
 * canvas, diagrams) are not in the HTML, so they are excluded by construction.
 * Exits 1 when `/` is over budget.
 */
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 170;
const PAGES: [string, string][] = [
  ["/", ".next/server/app/index.html"],
  ["/dev/type", ".next/server/app/dev/type.html"],
];

const kb = (n: number) => (n / 1024).toFixed(1);
let over = false;

for (const [route, file] of PAGES) {
  if (!existsSync(file)) {
    console.log(`${route}: not prerendered (run next build first)`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const tags = [...html.matchAll(/<script\b[^>]*\bsrc="(\/_next\/static\/[^"]+\.js)"[^>]*>/g)];
  const scripts = [...new Set(tags.filter((t) => !/\bnomodule\b/i.test(t[0])).map((t) => t[1]!))];
  const skipped = tags.length - scripts.length;
  let raw = 0;
  let gz = 0;
  for (const src of scripts) {
    const buf = readFileSync(`.next${src.replace("/_next", "")}`);
    raw += buf.length;
    gz += gzipSync(buf, { level: 9 }).length;
  }
  const css = [...new Set([...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]!))];
  const cssGz = css.reduce((n, s) => n + gzipSync(readFileSync(`.next${s.replace("/_next", "")}`)).length, 0);
  const flag = route === "/" ? (gz / 1024 > BUDGET_KB ? `  OVER ${BUDGET_KB} KB` : `  within ${BUDGET_KB} KB`) : "";
  if (route === "/" && gz / 1024 > BUDGET_KB) over = true;
  console.log(
    `${route}: ${scripts.length} scripts, ${kb(gz)} KB gz JS (${kb(raw)} KB raw), ${kb(cssGz)} KB gz CSS` +
      `${skipped ? `; ${skipped} nomodule skipped` : ""}${flag}`,
  );
}

if (over) process.exit(1);
