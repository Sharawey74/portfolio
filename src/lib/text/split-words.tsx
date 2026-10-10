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
 * break-colored period. `letters` also wraps every character in `.ch` with
 * `--c`, its index across the whole text (the hero name, ISS-50). `mark` wraps
 * the words of that phrase in one `.text-mark` span, so a line can be drawn
 * under them across line breaks. Use for headlines only (under ~30 words).
 */
export function SplitWords({
  text,
  trailing,
  offset = 0,
  letters = false,
  mark,
}: {
  text: string;
  trailing?: ReactNode;
  /** Index of the first word, to continue a stagger across elements. */
  offset?: number;
  letters?: boolean;
  /** A phrase of whole words inside `text`. */
  mark?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const markWords = mark ? mark.split(/\s+/).filter(Boolean) : [];
  let markStart = -1;
  if (markWords.length > 0) {
    const bare = (w: string | undefined) => w?.replace(/[.,;:]$/, "");
    markStart = words.findIndex((_, i) => markWords.every((m, k) => bare(words[i + k]) === m));
    if (markStart < 0) throw new Error(`SplitWords: "${mark}" is not a phrase of "${text}"`);
  }
  const markEnd = markStart < 0 ? -1 : markStart + markWords.length - 1;

  let c = 0;
  const word = (w: string, i: number) => (
    <span className="w">
      <span className="w-i" style={{ "--i": i + offset } as CSSProperties}>
        {letters
          ? [...w].map((ch) => (
              <span key={c} className="ch" style={{ "--c": c++ } as CSSProperties}>
                {ch}
              </span>
            ))
          : w}
        {i === words.length - 1 ? trailing : null}
      </span>
    </span>
  );

  const out: ReactNode[] = [];
  for (let i = 0; i < words.length; i++) {
    if (i === markStart) {
      const group = words.slice(markStart, markEnd + 1);
      out.push(
        <span key={`m${i}`}>
          <span className="text-mark">
            {group.map((w, k) => (
              <span key={k}>
                {word(w, markStart + k)}
                {k < group.length - 1 ? " " : null}
              </span>
            ))}
          </span>
          {markEnd < words.length - 1 ? " " : null}
        </span>,
      );
      i = markEnd;
      continue;
    }
    out.push(
      <span key={i}>
        {word(words[i]!, i)}
        {i < words.length - 1 ? " " : null}
      </span>,
    );
  }

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
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
