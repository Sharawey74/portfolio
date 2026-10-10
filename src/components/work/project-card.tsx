import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";
import { Chip } from "@/components/ui/chip.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { InView } from "@/components/motion/in-view.tsx";
import { FlowPreview } from "@/components/diagrams/flow-preview.tsx";
import { InteractiveCard } from "./interactive-card.tsx";
import { ScreenshotCarousel } from "./screenshot-carousel.tsx";

/** Screenshots on the home card's slider (the order is set in projects.ts). */
const SLIDES = 6;

/**
 * Featured project card (M7), one per tab (Stage 7, docs/ISSUES.md ISS-42).
 * From 1024 px two columns: the screenshot slider (or, without real
 * screenshots, the project's flow as a static diagram, from 768 px only: on a
 * phone its labels shrink to unreadable texture), then the copy: kind, name,
 * summary, stack chips, three sourced highlights with their qualifiers, and
 * the case-study and source links.
 * Title and first screenshot carry shared-element names for the route morph (M8).
 */
export function ProjectCard({ project }: { project: Project }) {
  const { ui } = profile;
  const highlights = project.highlights
    .map((id) => project.metrics.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);
  const repo = project.links.find((l) => l.kind === "repo");

  return (
    <InteractiveCard className="project-card surface-card lift grid gap-8 p-4 sm:p-5 lg:grid-cols-12 lg:gap-4">
      <div className="lg:col-span-7">
        {project.screenshots.length > 0 ? (
          <InView className="clip-reveal">
            <ScreenshotCarousel
              shots={project.screenshots.slice(0, SLIDES)}
              transitionName={`project-${project.slug}-media`}
              labels={{
                region: `${project.name} ${ui.carouselLabel}`,
                previous: ui.previous,
                next: ui.next,
                of: ui.slideOf,
                figure: ui.figure,
                screenshot: ui.screenshot,
              }}
            />
          </InView>
        ) : project.flow ? (
          <InView className="clip-reveal hidden rounded-inner border border-hair bg-raised p-4 md:block">
            <FlowPreview slug={project.slug} flow={project.flow} />
          </InView>
        ) : null}
      </div>
      <div className="flex flex-col gap-5 px-2 pb-3 lg:col-span-5 lg:px-5 lg:pt-6">
        <p className="mono-label text-ink-3">{project.tier === "flagship" ? ui.about.flagship : ui.caseStudy}</p>
        <ViewTransition name={`project-${project.slug}-title`} share="morph" default="none">
          <h3 className="font-heading text-section [overflow-wrap:anywhere]">{project.name}</h3>
        </ViewTransition>
        <p className="max-w-[46ch] text-ink-2">{project.summary.text}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label={ui.caseSections.stack}>
          {project.stack.slice(0, 5).map((s) => (
            <li key={s.name}>
              <Chip name={s.version ? `${s.name} ${s.version}` : s.name} />
            </li>
          ))}
        </ul>
        <dl className="flex flex-col border-t border-hair">
          {highlights.map((m) => (
            <div key={m.id} className="flex items-baseline gap-4 border-b border-hair py-3" title={`${ui.source}: ${m.source} (${ui.asOf} ${m.asOf})`}>
              <dt className="order-2 flex min-w-0 flex-col gap-0.5">
                <span className="text-small text-ink">{m.label}</span>
                {/* Qualifiers travel with their numbers ("local, Docker Compose"). */}
                {m.qualifier ? <span className="font-mono text-mono text-ink-3">{m.qualifier}</span> : null}
              </dt>
              <dd className="order-1 min-w-[6.5rem] font-heading text-h3 leading-none whitespace-nowrap">
                <CountUp display={m.display} />
                {m.unit ? <span className="text-small text-ink-2"> {m.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-small">
          <Link
            href={`/projects/${project.slug}`}
            data-cursor={ui.cursorView}
            data-magnetic=""
            data-press=""
            className="btn inline-flex min-h-11 items-center gap-3 rounded-pill border border-line px-5 font-medium text-ink transition-[background-color,border-color,translate] duration-200 ease-out hover:-translate-y-px hover:border-line-strong hover:bg-hover"
          >
            {ui.caseStudy}
            <span className="sr-only">: {project.name}</span>
            <span aria-hidden="true" data-arrow="right">→</span>
          </Link>
          {repo ? (
            <a href={repo.href} rel="noreferrer" className="nudge inline-flex min-h-11 items-center gap-1.5 text-ink-2 hover:text-ink">
              {repo.label}
              <span className="sr-only">
                : {project.name} ({ui.externalLink})
              </span>
              <span aria-hidden="true" data-arrow="out">↗</span>
            </a>
          ) : null}
        </p>
      </div>
    </InteractiveCard>
  );
}
