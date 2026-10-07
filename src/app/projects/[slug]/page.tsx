import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { caseStudies, getProject } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";
import { Chip } from "@/components/ui/chip.tsx";
import { Figure } from "@/components/ui/figure.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { TextLink } from "@/components/ui/text-link.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { InView } from "@/components/motion/in-view.tsx";
import { RevealText } from "@/components/motion/reveal-text.tsx";
import { FlowDiagram } from "@/components/diagrams/flow-diagram.tsx";
import { PointChart } from "@/components/charts/point-chart.tsx";
import { StepChart } from "@/components/charts/step-chart.tsx";
import { sourceHref } from "@/lib/sources.ts";
import { FocusHeading } from "./focus-heading.tsx";
import { ZoomGallery } from "./zoom-gallery.tsx";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.name} / ${profile.ui.caseStudy}`, description: p.summary.text.slice(0, 160) };
}

/** "Source · <file:lines> · as of <date>", linked to the pinned GitHub lines when public. */
function Source({ source, asOf }: { source: string; asOf: string }) {
  const { ui } = profile;
  const href = sourceHref(source);
  return (
    <span className="font-mono text-mono break-words text-ink-3">
      {ui.source} ·{" "}
      {href ? (
        <a href={href} rel="noreferrer" className="underline decoration-line decoration-1 underline-offset-2 hover:text-ink">
          {source}
          <span aria-hidden="true"> ↗</span>
        </a>
      ) : (
        source
      )}{" "}
      · {ui.asOf} <time dateTime={asOf}>{asOf}</time>
    </span>
  );
}

/**
 * Case study: problem → architecture (M9) → key decisions → evidence (numbers
 * with source and date, M9d charts) → screenshots → stack → links → limits.
 * Title and hero image share view-transition names with the home card (M8).
 */
export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project || project.tier === "secondary" || !project.flow || !project.problem) notFound();
  const { ui } = profile;
  const work = profile.sections.find((s) => s.id === "work")!;
  const s = ui.caseSections;
  const hero = project.screenshots[0];
  let fig = 0;

  return (
    <article className="case grid-12 gap-y-20 py-16 md:py-24">
      <FocusHeading id="case-title" />
      <header className="col-span-full flex flex-col gap-8 md:col-span-10 md:col-start-2">
        <Link href={`/#${work.id}`} className="mono-label w-fit text-ink-3 hover:text-ink">
          <span aria-hidden="true">← </span>
          <span className="num">{work.index}</span> / {ui.back}
        </Link>
        <ViewTransition name={`project-${project.slug}-title`} share="morph" default="none">
          <h1 id="case-title" tabIndex={-1} className="font-display text-display-xl font-light outline-none">
            {project.name}
          </h1>
        </ViewTransition>
        <p className="max-w-[60ch] text-h3 text-ink-2">{project.summary.text}</p>
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-small">
          {project.links.map((l) => (
            <span key={l.href}>
              <TextLink href={l.href}>{l.label}</TextLink>
              {l.note ? <span className="ml-2 font-mono text-mono text-ink-3">{l.note}</span> : null}
            </span>
          ))}
        </p>
      </header>

      {hero ? (
        <div className="col-span-full md:col-span-10 md:col-start-2">
          <ViewTransition name={`project-${project.slug}-media`} share="morph" default="none">
            <Image
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              sizes="(min-width: 768px) 80vw, 100vw"
              priority
              className="shot aspect-[16/10] w-full border border-hair object-cover object-top"
            />
          </ViewTransition>
        </div>
      ) : null}

      <section aria-labelledby="problem" className="col-span-full grid gap-6 md:col-span-10 md:col-start-2 md:grid-cols-10">
        <MonoLabel className="md:col-span-3">{s.problem}</MonoLabel>
        <div className="flex flex-col gap-3 md:col-span-7">
          <h2 id="problem" className="sr-only">
            {s.problem}
          </h2>
          <p className="font-display text-h3">{project.problem.text}</p>
          <Source source={project.problem.source} asOf={project.problem.asOf} />
          <ul className="mt-6 flex flex-col">
            {project.facts.map((f) => (
              <li key={f.text} className="flex flex-col gap-1 border-t border-hair py-4">
                <p className="text-ink-2">{f.text}</p>
                <Source source={f.source} asOf={f.asOf} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="architecture" className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
        <RevealText as="h2" id="architecture" text={s.architecture} className="font-display text-display-l" />
        <Figure number={++fig} caption={project.flow.caption} description={project.flow.steps.map((st) => st.label).join("; ")}>
          <FlowDiagram slug={project.slug} flow={project.flow} labels={ui.diagram} />
          <Source source={project.flow.source} asOf={project.flow.asOf} />
        </Figure>
      </section>

      <section aria-labelledby="decisions" className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
        <RevealText as="h2" id="decisions" text={s.decisions} className="font-display text-display-l" />
        <ol className="flex flex-col">
          {project.decisions.map((d, i) => (
            <li key={d.text} className="grid gap-2 border-t border-hair py-6 md:grid-cols-10 md:gap-6">
              <span className="num font-mono text-mono text-ink-3 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-2 md:col-span-9">
                <p className="text-body">{d.text}</p>
                <Source source={d.source} asOf={d.asOf} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="evidence" className="col-span-full flex flex-col gap-10 md:col-span-10 md:col-start-2">
        <RevealText as="h2" id="evidence" text={s.evidence} className="font-display text-display-l" />
        <dl className="grid grid-cols-1 gap-px bg-hair sm:grid-cols-2 lg:grid-cols-3">
          {project.metrics.map((m) => (
            <div key={m.id} className="flex flex-col gap-2 bg-page p-5">
              <dt className="mono-label order-2 text-ink-3">
                {m.label}
                {m.qualifier ? <span className="block normal-case tracking-normal">{m.qualifier}</span> : null}
              </dt>
              <dd className="order-1 font-display text-h2 leading-none">
                <CountUp display={m.display} />
                {m.unit ? <span className="ml-1 font-mono text-mono text-ink-3">{m.unit}</span> : null}
              </dd>
              <dd className="order-3">
                <Source source={m.source} asOf={m.asOf} />
              </dd>
            </div>
          ))}
        </dl>
        {project.charts.map((c) => (
          <Figure key={c.id} number={++fig} caption={`${c.caption} (${c.qualifier})`}>
            <InView className={`chart-reveal ${c.kind === "points" ? "max-w-[44rem]" : ""}`}>
              {c.kind === "points" ? <PointChart chart={c} /> : <StepChart chart={c} />}
            </InView>
            <p className="max-w-[70ch] text-small text-ink-2">{c.footnote}</p>
            <Source source={c.source} asOf={c.asOf} />
          </Figure>
        ))}
      </section>

      {project.screenshots.length > 0 ? (
        <section aria-labelledby="screenshots" className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
          <RevealText as="h2" id="screenshots" text={s.screenshots} className="font-display text-display-l" />
          <ZoomGallery shots={project.screenshots} labels={{ zoom: ui.zoom, close: ui.close, cursor: ui.cursorZoom }} />
        </section>
      ) : null}

      <section aria-labelledby="stack" className="col-span-full grid gap-6 md:col-span-10 md:col-start-2 md:grid-cols-10">
        <h2 id="stack" className="mono-label text-ink-3 md:col-span-3">
          {s.stack}
        </h2>
        <ul className="flex flex-wrap gap-2 md:col-span-7">
          {project.stack.map((st) => (
            <li key={st.name} title={`${ui.source}: ${st.source}`}>
              <Chip name={st.version ? `${st.name} ${st.version}` : st.name} />
            </li>
          ))}
        </ul>
      </section>

      {project.caveats.length > 0 ? (
        <section aria-labelledby="caveats" className="col-span-full grid gap-6 md:col-span-10 md:col-start-2 md:grid-cols-10">
          <h2 id="caveats" className="mono-label text-ink-3 md:col-span-3">
            {s.caveats}
          </h2>
          <ul className="flex flex-col gap-4 md:col-span-7">
            {project.caveats.map((c) => (
              <li key={c.text} className="flex flex-col gap-1">
                <p className="text-ink-2">{c.text}</p>
                <Source source={c.source} asOf={c.asOf} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
