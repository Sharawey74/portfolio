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
      className="ui-label inline-flex min-h-11 rounded-pill transition-colors duration-200 ease-out hover:bg-c1 min-w-11 items-center justify-center text-ink-2 hover:text-ink"
    >
      <span aria-hidden="true" className="text-body leading-none">{theme === "light" ? "●" : "○"}</span>
    </button>
  );
}
