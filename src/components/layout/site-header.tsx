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
  const contact = sections.find((s) => s.id === "contact" && s.live);
  return (
    <HeaderShell>
      <div className="mx-auto flex h-(--header-h) max-w-(--page-max) items-center justify-between gap-3 px-(--gutter) sm:gap-6">
        <Link href="/" className="shrink-0 font-display text-body leading-none tracking-tight text-ink md:text-h3">
          {personal.name.value ?? personal.github.handle}
          {personal.name.value ? <span className="text-break">.</span> : null}
        </Link>
        {/* From 1280 px (Stage 7: the Contact pill and switch need the room); below, "Menu" opens the palette. */}
        <div className="hidden min-w-0 flex-1 xl:block">
          <ScrollSpyNav items={navItems} label={ui.navLabel} />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <PaletteTrigger labels={{ open: ui.palette.open, menu: ui.palette.menu }} />
          <PauseToggle labels={{ pause: ui.pauseAnimations, play: ui.playAnimations }} />
          <ThemeToggle labels={{ toLight: ui.themeToLight, toDark: ui.themeToDark }} />
          {contact ? (
            <a
              href={`/#${contact.id}`}
              data-press=""
              className="nudge ui-label ml-1 hidden min-h-9 items-center gap-1.5 rounded-pill bg-ink px-4 text-page transition-[background-color,translate] duration-200 ease-out hover:-translate-y-px hover:bg-ink-soft sm:inline-flex"
            >
              {contact.title} <span data-arrow="right" aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </HeaderShell>
  );
}
