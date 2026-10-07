import type { CSSProperties, ReactNode } from "react";

/**
 * Splits short display text into masked words for M3 reveals. Server-safe: no
 * hooks, so the split markup is in the HTML and readable with JS off.
 *
 * Screen readers get the full sentence once (sr-only); the split copy is
 * aria-hidden. Each word is `.w` (the mask) > `.w-i` (the moving part) with
 * `--i` as its index for staggering. `--line` is filled in on the client by
 * assignLines() when a reveal staggers by line.
 *
 * `trailing` renders after the last word inside the same mask, e.g. the H1's
 * break-colored period. Use for headlines only (under ~12 words).
 */
export function SplitWords({
  text,
  trailing,
  offset = 0,
}: {
  text: string;
  trailing?: ReactNode;
  /** Index of the first word, to continue a stagger across elements. */
  offset?: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span className="w">
              <span className="w-i" style={{ "--i": i + offset } as CSSProperties}>
                {word}
                {i === words.length - 1 ? trailing : null}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

/**
 * Writes `--line` on every word from its rendered line, so a "lines" reveal
 * staggers line by line. Call after fonts are ready and on resize.
 */
export function assignLines(root: HTMLElement) {
  let line = -1;
  let top = Number.NEGATIVE_INFINITY;
  for (const w of root.querySelectorAll<HTMLElement>(".w")) {
    const t = w.offsetTop;
    if (t > top + 2) {
      line++;
      top = t;
    }
    w.querySelector<HTMLElement>(".w-i")?.style.setProperty("--line", String(line));
  }
}
