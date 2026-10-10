"use client";

import { useEffect, useSyncExternalStore, type MouseEvent } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { LIGHT_QUERY, applyTheme, pinnedTheme, switchTheme, systemTheme, type Theme } from "./theme-switch.ts";

/** The current theme is the data-theme attribute; observe it as an external store. */
function subscribeTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readTheme = (): Theme | null => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/**
 * Two-state toggle: follow the system, or pin the opposite (see switchTheme).
 * The switch is revealed by a View Transition circle from the button; reduced
 * motion and unsupported browsers switch instantly.
 */
export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => null);
  const { reducedMotion } = useMotionPrefs();

  // Follow OS changes while nothing is pinned.
  useEffect(() => {
    const mq = matchMedia(LIGHT_QUERY);
    const onChange = () => {
      if (!pinnedTheme()) applyTheme(systemTheme());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    switchTheme({ x: left + width / 2, y: top + height / 2 }, reducedMotion);
  }

  const label = theme === "light" ? labels.toDark : labels.toLight;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      disabled={theme === null}
      className="ui-label inline-flex min-h-11 min-w-11 items-center justify-center rounded-pill text-ink-2 transition-colors duration-200 ease-out hover:bg-hover hover:text-ink"
    >
      {/* A half-filled disc that turns half a circle with the theme (Stage 7). */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
        className="theme-glyph"
        data-theme-glyph={theme === "light" ? "light" : "dark"}
      >
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" />
      </svg>
    </button>
  );
}
