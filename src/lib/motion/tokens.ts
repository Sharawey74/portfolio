/**
 * Motion tokens for JS (WAAPI, scheduler tasks). Mirror the CSS tokens
 * --ease-out and --dur-1/2/3 in globals.css. Every JS-driven duration uses one
 * of these.
 */
export const EASE_OUT_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Milliseconds: 200 / 400 / 800. */
export const DUR_MS = { fast: 200, base: 400, slow: 800 } as const;
