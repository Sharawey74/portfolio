import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { Button, ButtonLink } from "@/components/ui/button.tsx";
import { RevealText } from "@/components/motion/reveal-text.tsx";
import { HeroGraph } from "./hero-graph.tsx";
import { HeroGraphStatic } from "./hero-graph-static.tsx";
import { HeroHeadline } from "./hero-headline.tsx";

/**
 * Hero: approved headline and sub, the node graph behind them (M4), CTAs.
 * "View My Work" renders only once its target section is live, so the page
 * never links to an anchor that does not exist. The resume button renders
 * disabled until the owner adds the PDF.
 */
export function Hero() {
  const { hero, ui, sections } = profile;
  const ctaTarget = hero.ctaPrimary.href.slice(1);
  const showPrimary = sections.some((s) => s.id === ctaTarget && s.live);
  const resume = personal.resumePdf.value;

  return (
    <section
      aria-labelledby="hero-title"
      className="hero relative isolate min-h-[calc(100svh-var(--header-h))] overflow-clip"
    >
      <HeroGraph>
        <HeroGraphStatic className="size-full" />
      </HeroGraph>
      <div className="grid-12 relative min-h-[inherit] content-end gap-y-10 pt-24 pb-16 md:pb-24 pointer-events-none">
        <div className="col-span-full md:col-span-11 pointer-events-auto">
          <HeroHeadline id="hero-title" text={hero.headline.text} />
        </div>
        <RevealText
          as="p"
          trigger="load"
          mode="lines"
          offset={8}
          text={hero.sub.text}
          className="hero-sub col-span-full max-w-[60ch] text-ink-2 md:col-span-6 md:col-start-6 pointer-events-auto"
        />
        <div className="hero-ctas col-span-full flex flex-wrap gap-3 md:col-span-6 md:col-start-6 pointer-events-auto">
          {showPrimary ? (
            <ButtonLink href={hero.ctaPrimary.href} magnetic>
              {hero.ctaPrimary.label} <span aria-hidden="true">→</span>
            </ButtonLink>
          ) : null}
          {resume ? (
            <ButtonLink href={resume} variant="outline" magnetic download>
              {hero.ctaResume.label} <span aria-hidden="true">↓</span>
            </ButtonLink>
          ) : (
            <Button variant="outline" disabled title={ui.resumeUnavailable}>
              {hero.ctaResume.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
