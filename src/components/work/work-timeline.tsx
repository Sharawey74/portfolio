import Link from "next/link";
import { ViewTransition } from "react";
import { projects, type Project } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";
import { projectLanes } from "@/data/skills.ts";
import { Chip } from "@/components/ui/chip.tsx";
import { quietButton } from "@/components/ui/button.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { InView } from "@/components/motion/in-view.tsx";
import { TraceLight } from "@/components/motion/trace-light.tsx";
import { FlowPreview } from "@/components/diagrams/flow-preview.tsx";
import { ScreenshotCarousel } from "./screenshot-carousel.tsx";

/** Screenshots on a row's slider (the order is set in projects.ts). */
const SLIDES = 6;

type Metric = Project["metrics"][number];

/**
 * Work as a numbered timeline (layout "trace", docs/ISSUES.md ISS-55;
 * replaces the tabs and "Also built"). Every project is a row on one rail:
 * its node (01 to 05, the order of projects.ts, not dates: the projects
 * carry none), the media on one side and the copy on the other, sides
 * alternating from 1024 px. Case studies keep the slider and the
 * case-study morph (M8 names); the two secondary projects show their
 * figures where the media would be. A row lights when the Stack section's
 * lane node for a technology it uses is pressed (html[data-stack-lane]).
 */
export function WorkTimeline() {
  const { ui } = profile;

  return (
    <TraceLight className="tl-wrap col-span-full">
      <span className="tl-rail" aria-hidden="true" />
      <ol className="tl" aria-label={ui.projectTabs}>
        {projects.map((p, i) => (
          <Row key={p.slug} project={p} n={i + 1} side={i % 2 === 0 ? "l" : "r"} />
        ))}
      </ol>
    </TraceLight>
  );
}

function Figures({ metrics }: { metrics: Metric[] }) {
  const { ui } = profile;
  return (
    <dl className="flex flex-col border-t border-hair">
      {metrics.map((m) => (
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
  );
}

function Row({ project: p, n, side }: { project: Project; n: number; side: "l" | "r" }) {
  const { ui } = profile;
  const secondary = p.tier === "secondary";
  const highlights = p.highlights.map((id) => p.metrics.find((m) => m.id === id)).filter((m): m is Metric => m !== undefined);
  const figures = secondary ? p.metrics.filter((m) => m.id !== "commits") : highlights;
  const repo = p.links.find((l) => l.kind === "repo");
  const used = projectLanes(p.slug);
  const kind = secondary ? ui.alsoBuilt : p.tier === "flagship" ? ui.about.flagship : ui.caseStudy;

  const media =
    p.screenshots.length > 0 ? (
      <InView className="clip-reveal">
        <ScreenshotCarousel
          shots={p.screenshots.slice(0, SLIDES)}
          transitionName={`project-${p.slug}-media`}
          labels={{
            region: `${p.name} ${ui.carouselLabel}`,
            previous: ui.previous,
            next: ui.next,
            of: ui.slideOf,
            figure: ui.figure,
            screenshot: ui.screenshot,
          }}
        />
      </InView>
    ) : p.flow ? (
      <InView className="clip-reveal hidden rounded-inner border border-hair bg-raised p-4 md:block">
        <FlowPreview slug={p.slug} flow={p.flow} />
      </InView>
    ) : figures.length > 0 ? (
      <div className="surface-card lift p-5 md:p-6">
        <Figures metrics={figures} />
      </div>
    ) : null;

  return (
    <li id={`project-${p.slug}`} className="tl-row" data-side={side} data-lanes={used.join(" ")}>
      <div className="tl-mark">
        <span className="tl-node num font-mono text-mono" data-node="">
          {String(n).padStart(2, "0")}
        </span>
      </div>
      {media ? <div className="tl-media">{media}</div> : null}
      <div className="tl-body flex flex-col gap-5">
        <p className="mono-label text-ink-3">
          {kind}
          {used.map((l) => (
            <span key={l} className="tl-use" data-lane={l}>
              {" "}
              · {ui.stack.uses} {ui.about.lanes[l]}
            </span>
          ))}
        </p>
        {secondary ? (
          <h3 className="font-heading text-section [overflow-wrap:anywhere]">{p.name}</h3>
        ) : (
          <ViewTransition name={`project-${p.slug}-title`} share="morph" default="none">
            <h3 className="font-heading text-section [overflow-wrap:anywhere]">{p.name}</h3>
          </ViewTransition>
        )}
        <p className="max-w-[46ch] text-ink-2">{p.summary.text}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label={ui.caseSections.stack}>
          {(secondary ? p.stack : p.stack.slice(0, 5)).map((s) => (
            <li key={s.name}>
              <Chip name={s.version ? `${s.name} ${s.version}` : s.name} />
            </li>
          ))}
        </ul>
        {secondary ? (
          [...p.facts, ...p.caveats].map((f) => (
            <p key={f.text} className="text-small text-ink-3">
              {f.text}
            </p>
          ))
        ) : (
          <>
            {/* With a slider or a diagram as media, the figures sit with the copy. */}
            {media && (p.screenshots.length > 0 || p.flow) ? <Figures metrics={highlights} /> : null}
          </>
        )}
        <p className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-small">
          {secondary ? (
            p.links.map((l) => (
              <a key={l.href} href={l.href} rel="noreferrer" data-press="" className={quietButton}>
                {l.label}
                <span className="sr-only">
                  : {p.name} ({ui.externalLink})
                </span>
                <span aria-hidden="true" data-arrow="out">↗</span>
              </a>
            ))
          ) : (
            <>
              <Link href={`/projects/${p.slug}`} data-press="" className={quietButton}>
                {ui.caseStudy}
                <span className="sr-only">: {p.name}</span>
                <span aria-hidden="true" data-arrow="right">→</span>
              </Link>
              {repo ? (
                <a href={repo.href} rel="noreferrer" data-press="" className={quietButton}>
                  {repo.label}
                  <span className="sr-only">
                    : {p.name} ({ui.externalLink})
                  </span>
                  <span aria-hidden="true" data-arrow="out">↗</span>
                </a>
              ) : null}
            </>
          )}
        </p>
      </div>
    </li>
  );
}
