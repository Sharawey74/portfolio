import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { ossSummary, type PullRequest } from "@/data/oss.ts";
import { Button, ButtonLink } from "@/components/ui/button.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { RevealText } from "@/components/motion/reveal-text.tsx";
import { HeroHeadline } from "./hero-headline.tsx";
import { HeroLight } from "./hero-light.tsx";
import { HeroFigures } from "./hero-figures.tsx";

/**
 * Hero (Stage 7, docs/ISSUES.md ISS-42): the announcement pill, role label,
 * the name as H1 (words blur into focus, gradient text), the approved lead
 * and second paragraph, CTAs; the CSS light on the right from 1024 px; the
 * figures strip below.
 * The pill's numbers come from ossSummary() over the same PR list the Open
 * source section renders. "View My Work" and the pill render only once their
 * target section is live. The resume button renders disabled until the owner
 * adds the PDF.
 */
export function Hero({ prs }: { prs: readonly PullRequest[] }) {
  const { hero, ui, sections } = profile;
  const isLive = (href: string) => sections.some((s) => s.id === href.slice(1) && s.live);
  const showPrimary = isLive(hero.ctaPrimary.href);
  const summary = ossSummary(prs);
  const announce = isLive(hero.announce.href)
    ? hero.announce.template.replace("{merged}", String(summary.merged)).replace("{projects}", String(summary.mergedProjects))
    : null;
  const resume = personal.resumePdf.value;

  return (
    <section
      aria-labelledby="hero-title"
      className="hero relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-clip"
    >
      <div className="grid-12 relative w-full items-center gap-y-[min(2.5rem,4svh)] pt-20 pb-[min(4rem,6svh)]">
        <div className="col-span-full flex flex-col gap-[min(1.75rem,3svh)] lg:col-span-7">
          {announce ? (
            <a href={hero.announce.href} className="hero-pill nudge self-start">
              <span className="hero-pill-inner text-small">
                <span aria-hidden="true" className="hero-pill-dot" />
                {announce}
                <span aria-hidden="true" data-arrow="right" className="text-ink-2">
                  →
                </span>
              </span>
            </a>
          ) : null}
          <div>
            <MonoLabel className="hero-label mb-5 block">{hero.label.text}</MonoLabel>
            <HeroHeadline id="hero-title" text={hero.headline.text} />
          </div>
          <div className="max-w-[60ch] space-y-4">
            <RevealText
              as="p"
              trigger="load"
              mode="lines"
              offset={8}
              text={hero.lead.text}
              className="hero-sub text-ink-soft"
            />
            <p className="hero-more text-ink-2">{hero.more.text}</p>
          </div>
          <div className="hero-ctas flex flex-wrap gap-3">
            {showPrimary ? (
              <ButtonLink href={hero.ctaPrimary.href} magnetic>
                {hero.ctaPrimary.label} <span aria-hidden="true" data-arrow="right">→</span>
              </ButtonLink>
            ) : null}
            {resume ? (
              <ButtonLink href={resume} variant="outline" magnetic download>
                {hero.ctaResume.label} <span aria-hidden="true" data-arrow="down">↓</span>
              </ButtonLink>
            ) : (
              <Button variant="outline" disabled title={ui.resumeUnavailable}>
                {hero.ctaResume.label}
              </Button>
            )}
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <HeroLight />
        </div>
        <HeroFigures />
      </div>
    </section>
  );
}
