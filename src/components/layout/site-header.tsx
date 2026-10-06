import Link from "next/link";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { PauseToggle } from "@/components/motion/pause-toggle.tsx";
import { ThemeToggle } from "@/components/theme/theme-toggle.tsx";

/**
 * Stage 1 header: wordmark and the two global controls. Section navigation,
 * scroll-spy and hide-on-scroll arrive in Stage 2 (M13).
 * The wordmark uses the public name once the owner sets it, else the handle.
 */
export function SiteHeader() {
  const { ui } = profile;
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-hair bg-page">
      <div className="mx-auto flex h-full max-w-(--page-max) items-center justify-between px-(--gutter)">
        <Link href="/" className="font-mono text-mono-lg tracking-wide text-ink">
          {personal.name.value ?? personal.github.handle}
        </Link>
        <div className="flex items-center gap-2">
          <PauseToggle labels={{ pause: ui.pauseAnimations, play: ui.playAnimations }} />
          <ThemeToggle labels={{ toLight: ui.themeToLight, toDark: ui.themeToDark }} />
        </div>
      </div>
    </header>
  );
}
