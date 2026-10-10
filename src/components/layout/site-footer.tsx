import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { ScrambleText } from "@/components/motion/scramble.tsx";
import { BrandIcon, type IconKind } from "@/components/ui/brand-icon.tsx";
import { FooterPaletteButton } from "./footer-palette-button.tsx";

/**
 * Footer (Stage 7, ISS-42): the name with its --break period and the license
 * line, a titled column of section links, a titled column of outbound links
 * with brand icons (they lift and take the accent on hover), then the
 * sourcing note and "back to top". Section links point at `/#id`, so they
 * work from case-study pages too.
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
      <div className="grid-12 gap-y-12 py-16 md:py-20">
        <div className="col-span-full flex flex-col gap-3 md:col-span-6">
          <p className="font-display text-h3 leading-none tracking-tight text-ink">
            {name}
            {personal.name.value ? <span className="text-break">.</span> : null}
          </p>
          <p className="font-mono text-mono text-ink-3">{ui.footer.license}</p>
        </div>

        <nav aria-label={ui.footer.nav} className="col-span-2 flex flex-col gap-2 md:col-span-3 md:col-start-8">
          <p className="ui-label text-ink">{ui.footer.sectionsTitle}</p>
          <ul className="flex flex-col">
            {live.map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`} className="footer-link ui-label">
                  <ScrambleText text={s.title} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 flex flex-col gap-2 md:col-span-2">
          <p className="ui-label text-ink">{ui.footer.elsewhereTitle}</p>
          <ul className="flex flex-col">
            {outbound.map((l) => {
              const external = l.href.startsWith("https://");
              return (
                <li key={l.href}>
                  <a href={l.href} rel={external ? "noreferrer" : undefined} className="footer-link icon-link nudge ui-label">
                    <BrandIcon kind={l.icon} />
                    <ScrambleText text={l.label} />
                    <span data-arrow={external ? "out" : "right"} aria-hidden="true">
                      {external ? "↗" : "→"}
                    </span>
                    {external ? <span className="sr-only"> ({ui.externalLink})</span> : null}
                  </a>
                </li>
              );
            })}
            <li>
              <FooterPaletteButton label={ui.footer.palette} />
            </li>
          </ul>
        </div>

        <div className="col-span-full flex flex-col gap-3 border-t border-hair pt-6 md:flex-row md:items-baseline md:justify-between">
          <p className="max-w-[60ch] text-small text-ink-3">{ui.footer.sources}</p>
          <a href="#main" className="footer-link ui-label">
            <ScrambleText text={ui.footer.backToTop} /> <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
