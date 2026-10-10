// Hero core probe (docs/ISSUES.md ISS-51, docs/TESTING.md). Not part of CI:
// it reads canvas pixels over time, which needs a real, unhurried browser.
//
// Usage: build, start the site on port 3107 (`npm run build`, `npm start -- -p 3107`),
// then `node scripts/probe-hero-core.mjs [outDir]`. Prints one JSON report and,
// with outDir, writes hero screenshots per theme and width.
//
// It checks, at 1440 x 900 in both themes:
// - the sphere's code loads after the page (one extra script chunk), not before;
// - the canvas changes between two reads 300 ms apart (it moves);
// - with "Pause animations" on, it does not change over 500 ms (WCAG 2.2.2);
// - scrolled out of view, it does not change (the loop stops off screen);
// and with reduced motion, that it is drawn once and stays still; and at
// 320 to 1280 px, whether the core shows, that the page has no horizontal
// scroll, and how many lines the name takes (2 means no word broke).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3107";
const out = process.argv[2];
if (out) mkdirSync(out, { recursive: true });

const hash = (page) =>
  page.evaluate(() => {
    const c = document.querySelector(".hero-core canvas");
    if (!c) return null;
    const d = c.toDataURL();
    let h = 0;
    for (let i = 0; i < d.length; i += 7) h = (h * 31 + d.charCodeAt(i)) | 0;
    return h;
  });
const settle = (page, ms) => page.waitForTimeout(ms);

const browser = await chromium.launch();
const report = { errors: [] };

for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && report.errors.push(`${theme}: ${m.text()}`));
  let chunks = 0;
  page.on("request", (q) => q.url().includes("/_next/static/chunks/") && chunks++);
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  const atLoad = chunks;
  await page.waitForSelector(".hero-core canvas", { timeout: 8000 });
  const r = { chunksAtLoad: atLoad, chunksAfterIdle: chunks };
  await settle(page, 2500);
  const a = await hash(page);
  await settle(page, 300);
  r.moves = a !== (await hash(page));
  await page.mouse.move(1300, 200);
  await settle(page, 1200);
  if (out) await page.screenshot({ path: `${out}/${theme}-1440.png` });

  const pause = page.getByRole("switch", { name: /pause animations/i }).first();
  await pause.click();
  await settle(page, 300);
  const p = await hash(page);
  await settle(page, 500);
  r.stillWhenPaused = p === (await hash(page));
  r.pausedAttr = await page.evaluate(() => document.documentElement.dataset.motion);
  await pause.click();
  await settle(page, 300);
  const q = await hash(page);
  await settle(page, 300);
  r.movesAfterResume = q !== (await hash(page));

  await page.evaluate(() => window.scrollTo(0, 3000));
  await settle(page, 600);
  const o = await hash(page);
  await settle(page, 500);
  r.stillOffScreen = o === (await hash(page));
  report[theme] = r;
  await ctx.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector(".hero-core canvas", { timeout: 8000 });
  await settle(page, 1500);
  const a = await hash(page);
  await settle(page, 600);
  report.reducedMotion = { drawn: a !== null, still: a === (await hash(page)) };
  await ctx.close();
}

for (const w of [320, 375, 768, 1024, 1279, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 812 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await settle(page, 3500);
  report[`w${w}`] = await page.evaluate(() => {
    const letters = [...document.querySelectorAll(".hero-h1 .ch")];
    return {
      coreShown: !!document.querySelector(".hero-core")?.offsetParent,
      canvas: !!document.querySelector(".hero-core canvas"),
      noHorizontalScroll: document.documentElement.scrollWidth <= innerWidth,
      nameLines: new Set(letters.map((c) => Math.round(c.getBoundingClientRect().top))).size,
    };
  });
  if (out) await page.screenshot({ path: `${out}/hero-${w}.png` });
  await ctx.close();
}

console.log(JSON.stringify(report, null, 1));
await browser.close();
