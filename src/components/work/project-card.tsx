import Link from "next/link";
import { ViewTransition } from "react";
import type { Project } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";
import { CountUp } from "@/components/motion/count-up.tsx";
import { InView } from "@/components/motion/in-view.tsx";
import { FlowPreview } from "@/components/diagrams/flow-preview.tsx";
import { InteractiveCard } from "./interactive-card.tsx";
import { ScreenshotCarousel } from "./screenshot-carousel.tsx";

/**
 * Featured project card (M7) inside the sticky stack (M6). Left: index
 * numeral (parallax decoration), title, summary, three sourced highlights,
 * the case-study link. Right: the screenshot carousel, or the project's flow
 * as a static diagram when there are no real screenshots.
 * Title and first screenshot carry shared-element names for the route morph (M8).
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ui } = profile;
  const highlights = project.highlights
    .map((id) => project.metrics.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => m !== undefined);

  return (
    <InteractiveCard className="project-card grid gap-8 border border-hair bg-card p-6 md:grid-cols-12 md:gap-6 md:p-10">
      <div className="flex flex-col gap-6 md:col-span-5">
        <span aria-hidden="true" className="card-numeral num font-display">
          {String(index + 1).padStart(2, "0")}
        </span>
        <ViewTransition name={`project-${project.slug}-title`} share="morph" default="none">
          <h3 className="font-display text-display-l">{project.name}</h3>
        </ViewTransition>
        <p className="max-w-[46ch] text-ink-2">{project.summary.text}</p>
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-x-4 gap-y-5 border-t border-hair pt-5">
          {highlights.map((m) => (
            <div key={m.id} className="flex min-w-0 flex-col gap-1" title={`${ui.source}: ${m.source} (${ui.asOf} ${m.asOf})`}>
              <dt className="mono-label order-2 text-ink-3">{m.label}</dt>
              <dd className="order-1 font-display text-h3 leading-none whitespace-nowrap">
                <CountUp display={m.display} />
                {m.unit ? <span className="ml-1 font-mono text-mono text-ink-3">{m.unit}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto">
          <Link
            href={`/projects/${project.slug}`}
            data-cursor={ui.cursorView}
            data-magnetic=""
            className="inline-flex min-h-11 items-center gap-3 border border-line-strong px-5 text-small font-medium text-ink transition-colors duration-200 ease-out hover:border-ink hover:bg-hover"
          >
            {ui.caseStudy}
            <span className="sr-only">: {project.name}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="md:col-span-7">
        {project.screenshots.length > 0 ? (
          <InView className="clip-reveal">
            <ScreenshotCarousel
              shots={project.screenshots.slice(0, 4)}
              transitionName={`project-${project.slug}-media`}
              labels={{ region: `${project.name} ${ui.carouselLabel}`, previous: ui.previous, next: ui.next, of: ui.slideOf }}
            />
          </InView>
        ) : project.flow ? (
          <InView className="clip-reveal border border-hair bg-raised p-4">
            <FlowPreview slug={project.slug} flow={project.flow} />
          </InView>
        ) : null}
      </div>
    </InteractiveCard>
  );
}
