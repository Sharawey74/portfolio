import Link from "next/link";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { PauseToggle } from "@/components/motion/pause-toggle.tsx";
import { ThemeToggle } from "@/components/theme/theme-toggle.tsx";
import { HeaderShell } from "./header-shell.tsx";
import { ScrollSpyNav } from "./scroll-spy-nav.tsx";

/**
 * Header: wordmark, section nav with scroll-spy, and the two global controls.
 * The nav lists only sections marked `live` in profile.ts, so it never links
 * to a section that is not on the page yet. Hides on scroll down (HeaderShell).
 * The wordmark uses the public name once the owner sets it, else the handle.
 */
export function SiteHeader() {
  const { ui, sections } = profile;
  const navItems = sections.filter((s) => s.live).map(({ id, index, title }) => ({ id, index, title }));
  return (
    <HeaderShell>
      <div className="mx-auto flex h-(--header-h) max-w-(--page-max) items-center justify-between gap-6 px-(--gutter)">
        <Link href="/" className="shrink-0 font-mono text-mono-lg tracking-wide text-ink">
          {personal.name.value ?? personal.github.handle}
        </Link>
        <div className="hidden min-w-0 flex-1 md:block">
          <ScrollSpyNav items={navItems} label={ui.navLabel} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <PauseToggle labels={{ pause: ui.pauseAnimations, play: ui.playAnimations }} />
          <ThemeToggle labels={{ toLight: ui.themeToLight, toDark: ui.themeToDark }} />
        </div>
      </div>
    </HeaderShell>
  );
}
