import { DUR_MS, EASE_OUT_CSS } from "@/lib/motion/tokens.ts";

export type Theme = "light" | "dark";
const STORAGE_KEY = "theme";
export const LIGHT_QUERY = "(prefers-color-scheme: light)";

export const systemTheme = (): Theme => (matchMedia(LIGHT_QUERY).matches ? "light" : "dark");
export const currentTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (meta) meta.content = theme;
}

export function pinnedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Switch to the other theme. Choosing the system's own value clears the pin,
 * so a later OS change is followed. With an origin point and motion allowed,
 * the new theme is revealed by a View Transition circle from that point.
 */
export function switchTheme(origin: { x: number; y: number } | null, reducedMotion: boolean) {
  const next: Theme = currentTheme() === "light" ? "dark" : "light";
  try {
    if (next === systemTheme()) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }

  const update = () => applyTheme(next);
  if (!origin || reducedMotion || typeof document.startViewTransition !== "function") {
    update();
    return;
  }

  const { x, y } = origin;
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
