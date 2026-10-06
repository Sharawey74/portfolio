"use client";

import { useEffect, useSyncExternalStore, type MouseEvent } from "react";
import { useMotionPrefs } from "@/lib/motion/preferences.ts";
import { DUR_MS, EASE_OUT_CSS } from "@/lib/motion/tokens.ts";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

const systemTheme = (): Theme => (matchMedia(LIGHT_QUERY).matches ? "light" : "dark");

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (meta) meta.content = theme;
}

/** The current theme is the data-theme attribute; observe it as an external store. */
function subscribeTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readTheme = (): Theme | null => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function pinned(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Two-state toggle: follow the system, or pin the opposite. Choosing the
 * system's own value again clears the pin, so a later OS change is followed.
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
      if (!pinned()) apply(systemTheme());
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "light" ? "dark" : "light";
    try {
      if (next === systemTheme()) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }

    const update = () => apply(next);

    if (reducedMotion || typeof document.startViewTransition !== "function") {
      update();
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(update);
    transition.ready
      .then(() =>
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: DUR_MS.slow, easing: EASE_OUT_CSS, pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
  }

  const label = theme === "light" ? labels.toDark : labels.toLight;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      disabled={theme === null}
      className="mono-label inline-flex min-h-11 min-w-11 items-center justify-center text-ink-2 hover:text-ink"
    >
      <span aria-hidden="true" className="text-body leading-none">{theme === "light" ? "●" : "○"}</span>
    </button>
  );
}
