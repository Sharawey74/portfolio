import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";

/**
 * The type pairing. Swap a family here and nowhere else; globals.css reads the
 * three CSS variables. Never use Inter, Roboto, Arial, system-ui, Space Grotesk
 * or Geist.
 */

/**
 * Display: variable opsz + wght (normal style only; see below).
 * `optional`, not `swap`: the hero headline is large and bottom-aligned, so a
 * late swap re-wraps it and moved the hero by CLS 0.188 on a throttled mobile
 * run. The font is preloaded; a visit that misses the short block period keeps
 * the metric-adjusted fallback serif for that page view, with no shift.
 */
export const display = Newsreader({
  subsets: ["latin"],
  // Normal only: the italic face is a second ~140 KB variable file, preloaded
  // ahead of the LCP image on slow connections, and no page uses it (Stage 5).
  // Add "italic" back when content needs an emphasis word.
  style: ["normal"],
  axes: ["opsz"],
  display: "optional",
  variable: "--font-newsreader",
});

/** Text and UI. */
export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

/**
 * Labels, numbers, metadata, figure captions. Weight 400 only: nothing sets
 * another weight on mono text, and the static file is 20.7 KB against 39.5 KB
 * for the variable one (preloaded on every page; docs/ISSUES.md ISS-36).
 */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-jetbrains",
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
