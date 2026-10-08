"use client";

import { setPaused, useMotionPrefs } from "@/lib/motion/preferences.ts";

/** Global "Pause animations" control (WCAG 2.2.2). Persisted per browser. */
export function PauseToggle({ labels }: { labels: { pause: string; play: string } }) {
  const { paused, reducedMotion } = useMotionPrefs();
  // Under reduced motion nothing autoplays, so the control has nothing to do.
  if (reducedMotion) return null;
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
      className="ui-label inline-flex min-h-11 rounded-pill transition-colors duration-200 ease-out hover:bg-c1 min-w-11 items-center justify-center gap-2 px-3 text-ink-2 hover:text-ink"
    >
      <span aria-hidden="true">{paused ? "▶︎" : "❙❙"}</span>
      <span className="max-md:sr-only">{paused ? labels.play : labels.pause}</span>
    </button>
  );
}
