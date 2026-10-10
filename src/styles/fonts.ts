import { Instrument_Sans, Inter, Newsreader } from "next/font/google";
import localFont from "next/font/local";

/**
 * The type system (Stage 7, docs/ISSUES.md ISS-42): Newsreader for the display
 * lines, Instrument Sans for section headings and figures, Inter for body and
 * interface text, Commit Mono for code, numbers in captions and metadata.
 * All four are free (OFL). Swap a family here and nowhere else; globals.css
 * reads the CSS variables.
 */

/**
 * Display: variable opsz + wght (normal style only; see below).
 * `optional`, not `swap`: the hero headline is large and bottom-aligned, so a
 * late swap re-wraps it and moved the hero by CLS 0.188 on a throttled mobile
 * run. The font is preloaded; a visit that misses the short block period keeps
 * the metric-adjusted fallback serif for that page view, with no shift.
 * The opsz axis stays: owner decision 2026-10-09 (ISS-36).
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

/** Body and interface text. Preloaded: the hero paragraph is the LCP element on `/`. */
export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Section headings and figures. Not preloaded: nothing set in it is in the
 * first paint's LCP element, and every preload competes with the CSS on slow
 * connections (ISS-36). The metric-adjusted fallback keeps the swap shift small.
 */
export const heading = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-instrument",
});

/**
 * Code, figure captions, sources and metadata. Self-hosted from
 * @fontsource/commit-mono (OFL; the package ships the licence). Weight 400
 * only, latin subset, 47 KB; not preloaded, for the same reason as above.
 */
export const mono = localFont({
  src: "../../node_modules/@fontsource/commit-mono/files/commit-mono-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  variable: "--font-commit",
});

export const fontVariables = `${display.variable} ${sans.variable} ${heading.variable} ${mono.variable}`;
