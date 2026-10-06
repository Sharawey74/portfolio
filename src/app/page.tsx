import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { Button, ButtonLink } from "@/components/ui/button.tsx";

/**
 * Stage 1 placeholder: the approved hero copy, static. Stage 2 replaces this
 * with the full hero (M1, M3, M4) and adds the sections.
 */
export default function Home() {
  const { hero, ui } = profile;
  const headline = hero.headline.text.replace(/\.$/, "");
  const resume = personal.resumePdf.value;

  return (
    <section aria-labelledby="hero-title" className="grid-12 min-h-[calc(100dvh-var(--header-h))] content-center gap-y-10 py-16">
      <h1 id="hero-title" className="col-span-full font-display text-display-xl font-light md:col-span-11">
        {headline}
        <span className="text-break">.</span>
      </h1>
      <p className="col-span-full max-w-[60ch] text-ink-2 md:col-span-6 md:col-start-6">{hero.sub.text}</p>
      <div className="col-span-full flex flex-wrap gap-3 md:col-span-6 md:col-start-6">
        <ButtonLink href={hero.ctaPrimary.href} magnetic>
          {hero.ctaPrimary.label} <span aria-hidden="true">→</span>
        </ButtonLink>
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
    </section>
  );
}
