import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { ScrambleText } from "@/components/motion/scramble.tsx";
import { BrandIcon, type IconKind } from "@/components/ui/brand-icon.tsx";
import { FooterPaletteButton } from "./footer-palette-button.tsx";

/**
 * Footer: section index, outbound links, the sourcing note, license line.
 * Section links point at `/#id`, so they work from case-study pages too.
 */
export function SiteFooter() {
  const { ui, sections } = profile;
  const live = sections.filter((s) => s.live);
  const name = personal.name.value ?? personal.github.handle;
  const outbound: { label: string; href: string; icon: IconKind }[] = [
    { label: "GitHub", href: personal.github.href, icon: "github" },
    { label: "LinkedIn", href: personal.linkedin.href, icon: "linkedin" },
    ...(personal.email.value ? [{ label: ui.palette.email, href: `mailto:${personal.email.value}`, icon: "email" as const }] : []),
  ];

  return (
    <footer className="site-footer border-t border-hair">
      <div className="grid-12 gap-y-12 py-16 md:py-24">
        <p className="col-span-full font-display text-display-l leading-none md:col-span-6">{name}</p>

        <nav aria-label={ui.footer.nav} className="col-span-2 md:col-span-3 md:col-start-8">
          <ul className="flex flex-col gap-1">
            {live.map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`} className="footer-link ui-label">
                  <span className="num font-mono text-mono text-ink-3">{s.index}</span> <ScrambleText text={s.title} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="col-span-2 flex flex-col gap-1 md:col-span-2">
          {outbound.map((l) => {
            const external = l.href.startsWith("https://");
            return (
              <li key={l.href}>
                <a href={l.href} rel={external ? "noreferrer" : undefined} className="footer-link ui-label">
                  <BrandIcon kind={l.icon} />
                  <ScrambleText text={l.label} /> <span aria-hidden="true">{external ? "↗" : "→"}</span>
                  {external ? <span className="sr-only"> ({ui.externalLink})</span> : null}
                </a>
              </li>
            );
          })}
          <li>
            <FooterPaletteButton label={ui.footer.palette} />
          </li>
        </ul>

        <div className="col-span-full flex flex-col gap-3 border-t border-hair pt-6 md:flex-row md:items-baseline md:justify-between">
          <p className="max-w-[60ch] text-small text-ink-3">{ui.footer.sources}</p>
          <p className="font-mono text-mono text-ink-3">{ui.footer.license}</p>
          <a href="#main" className="footer-link ui-label">
            <ScrambleText text={ui.footer.backToTop} /> <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
