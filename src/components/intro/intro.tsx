import { personal } from "@/data/personal.ts";
import { SplitWords } from "@/lib/text/split-words.tsx";

/**
 * M1 intro. Pure CSS, no client JS: the pre-paint script sets
 * html[data-intro="play"] on the first visit of a session (and never under
 * reduced motion, Save-Data or the global pause). The overlay counts 000 to
 * 100 with an @property integer, then lifts with clip-path. Total 1.75 s.
 * The page is already rendered beneath it. Decorative, so aria-hidden.
 * Without a public name the overlay shows the counter alone.
 */
export function Intro() {
  const name = personal.name.value;
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-inner">
        {name ? (
          <p className="intro-name font-display text-display-l font-light">
            <SplitWords text={name} />
          </p>
        ) : null}
        <div className="intro-meter">
          <span className="intro-count num font-mono text-mono-lg" />
          <span className="intro-bar" />
        </div>
      </div>
    </div>
  );
}
