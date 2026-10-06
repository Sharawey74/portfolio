import { Hanken_Grotesk, JetBrains_Mono, Newsreader } from "next/font/google";

/**
 * The type pairing. Swap a family here and nowhere else; globals.css reads the
 * three CSS variables. Never use Inter, Roboto, Arial, system-ui, Space Grotesk
 * or Geist.
 */

/** Display: variable opsz + wght, with italic for single emphasis words. */
export const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
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
