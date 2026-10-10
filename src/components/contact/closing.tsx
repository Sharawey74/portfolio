import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { ButtonLink } from "@/components/ui/button.tsx";
import { BrandIcon, type IconKind } from "@/components/ui/brand-icon.tsx";
import { RevealText } from "@/components/motion/reveal-text.tsx";
import { LoopGate } from "@/components/motion/loop-gate.tsx";

/**
 * Closing line before Contact (Stage 7, docs/ISSUES.md ISS-42): the hero's
 * claim in one display line with gradient text over a soft accent glow (the
 * one glow outside the hero, breathing slowly while visible), a button to the form, and the direct links as
 * pills whose icons lift and take the accent on hover. Phone and email appear
 * only once set in personal.ts.
 */
export function Closing() {
  const { ui, closing } = profile;
  const links: { label: string; href: string; icon?: IconKind }[] = [
    ...(personal.email.value ? [{ label: personal.email.value, href: `mailto:${personal.email.value}`, icon: "email" as const }] : []),
    ...(personal.phone.value ? [{ label: personal.phone.value, href: `tel:${personal.phone.value.replace(/\s+/g, "")}` }] : []),
    { label: `GitHub / ${personal.github.handle}`, href: personal.github.href, icon: "github" },
    { label: "LinkedIn", href: personal.linkedin.href, icon: "linkedin" },
  ];

  return (
    <section aria-labelledby="closing" className="closing grid-12 py-24 md:py-36">
      <LoopGate className="closing-glow" />
      <div className="col-span-full flex flex-col items-center gap-8 text-center md:col-span-10 md:col-start-2">
        <RevealText as="h2" id="closing" text={closing.line.text} className="max-w-[16ch] font-display text-display-l font-light text-gradient" />
        <ButtonLink href={closing.cta.href}>
          {closing.cta.label} <span aria-hidden="true" data-arrow="right">→</span>
        </ButtonLink>
        <ul className="rise flex flex-wrap justify-center gap-2.5" aria-label={ui.contact.direct}>
          {links.map((l) => {
            const external = l.href.startsWith("https://");
            return (
              <li key={l.href} className="min-w-0">
                <a
                  href={l.href}
                  rel={external ? "noreferrer" : undefined}
                  data-press=""
                  className="icon-link inline-flex min-h-11 max-w-full items-center gap-2.5 rounded-pill border border-line px-4 text-small text-ink transition-[border-color,background-color,translate] duration-200 ease-out hover:-translate-y-px hover:border-line-strong hover:bg-hover"
                >
                  {l.icon ? <BrandIcon kind={l.icon} /> : null}
                  <span className="min-w-0 wrap-anywhere">{l.label}</span>
                  {external ? <span className="sr-only"> ({ui.externalLink})</span> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
