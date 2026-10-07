import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";

/**
 * The type pairing. Swap a family here and nowhere else; globals.css reads the
 * three CSS variables. Never use Inter, Roboto, Arial, system-ui, Space Grotesk
 * or Geist.
 */

/**
 * Display: variable opsz + wght, with italic for single emphasis words.
 * `optional`, not `swap`: the hero headline is large and bottom-aligned, so a
 * late swap re-wraps it and moved the hero by CLS 0.188 on a throttled mobile
 * run. The font is preloaded; a visit that misses the short block period keeps
 * the metric-adjusted fallback serif for that page view, with no shift.
 */
export const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
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

/** Labels, numbers, metadata, figure captions. */
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
