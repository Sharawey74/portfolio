"use client";

import { setPaused, useMotionPrefs } from "@/lib/motion/preferences.ts";

/**
 * Global "Pause animations" control (WCAG 2.2.2), drawn as a switch whose knob
 * slides and turns the track --break when on (Stage 7, ISS-42). Persisted per
 * browser. The visible label is the action's name; aria-checked carries state.
 */
export function PauseToggle({ labels }: { labels: { pause: string; play: string } }) {
  const { paused, reducedMotion } = useMotionPrefs();
  // Under reduced motion nothing autoplays, so the control has nothing to do.
  if (reducedMotion) return null;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={paused}
      onClick={() => setPaused(!paused)}
      className="ui-label inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-pill px-3 text-ink-2 transition-colors duration-200 ease-out hover:bg-hover hover:text-ink"
    >
      <span aria-hidden="true" className="switch-track">
        <span className="switch-knob" />
      </span>
      <span className="max-md:sr-only">{labels.pause}</span>
    </button>
  );
}
