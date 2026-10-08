import Link from "next/link";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { PauseToggle } from "@/components/motion/pause-toggle.tsx";
import { ThemeToggle } from "@/components/theme/theme-toggle.tsx";
import { PaletteTrigger } from "@/components/palette/palette-trigger.tsx";
import { HeaderShell } from "./header-shell.tsx";
import { ScrollSpyNav } from "./scroll-spy-nav.tsx";

/**
 * Header: wordmark, section nav with scroll-spy, the palette button (the
 * menu below 1024 px, where the section links do not fit) and the two global
 * controls.
 * The nav lists only sections marked `live` in profile.ts, so it never links
 * to a section that is not on the page yet. Hides on scroll down (HeaderShell).
 * The wordmark uses the public name once the owner sets it, else the handle.
 */
export function SiteHeader() {
  const { ui, sections } = profile;
  const navItems = sections.filter((s) => s.live).map(({ id, index, title }) => ({ id, index, title }));
  return (
    <HeaderShell>
      <div className="mx-auto flex h-(--header-h) max-w-(--page-max) items-center justify-between gap-3 px-(--gutter) sm:gap-6">
        <Link href="/" className="shrink-0 font-display text-body leading-none text-ink md:text-h3">
          {personal.name.value ?? personal.github.handle}
        </Link>
        <div className="hidden min-w-0 flex-1 lg:block">
          <ScrollSpyNav items={navItems} label={ui.navLabel} />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <PaletteTrigger labels={{ open: ui.palette.open, menu: ui.palette.menu }} />
          <PauseToggle labels={{ pause: ui.pauseAnimations, play: ui.playAnimations }} />
          <ThemeToggle labels={{ toLight: ui.themeToLight, toDark: ui.themeToDark }} />
        </div>
      </div>
    </HeaderShell>
  );
}
