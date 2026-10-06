/**
 * Launch check. Run: npm run check:launch  [-- --strict]
 *
 * Lists every `TODO(owner): ...` left in src/data. Exits 0 by default so
 * preview builds succeed with empty personal fields. Exits 1 if any remain and
 * `--strict` is passed or LAUNCH_STRICT=1 is set (owner sets that on the
 * Vercel production build when ready to launch). Runs before `next build`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dataDir = new URL("../src/data/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const strict = process.argv.includes("--strict") || process.env.LAUNCH_STRICT === "1";

const items: { file: string; text: string }[] = [];
for (const file of readdirSync(dataDir).sort()) {
  if (!/\.(ts|json)$/.test(file) || file === "schema.ts") continue;
  const text = readFileSync(join(dataDir, file), "utf8");
  for (const m of text.matchAll(/"(TODO\(owner\): [^"]+)"/g)) items.push({ file, text: m[1]! });
}

if (items.length === 0) {
  console.log("launch check: no TODO(owner) items left");
  process.exit(0);
}

console.log(`launch check: ${items.length} TODO(owner) item(s)${strict ? " (strict)" : ""}`);
for (const { file, text } of items) console.log(`  - src/data/${file}: ${text.replace("TODO(owner): ", "")}`);

if (strict) {
  console.error("launch check: failing because LAUNCH_STRICT=1 / --strict and items remain");
  process.exit(1);
}
