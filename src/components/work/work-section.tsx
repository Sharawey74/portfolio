import { caseStudies, secondaryProjects } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { Chip } from "@/components/ui/chip.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { InteractiveCard } from "./interactive-card.tsx";
import { ProjectCard } from "./project-card.tsx";
import { WorkTabs } from "./work-tabs.tsx";

/**
 * 02 / Work. The featured projects behind tabs, one card at a time (Stage 7,
 * docs/ISSUES.md ISS-42; the M6 sticky stack is retired), then "Also built":
 * the secondary projects as two cards (no case study), each with its sourced
 * figures, stack, facts and limits. The stack by lane lives in About
 * (owner decision, Stage 5 D2), so it is not repeated here.
 */
export function WorkSection() {
  const { ui, sections } = profile;
  const section = sections.find((s) => s.id === "work")!;

  return (
    <section aria-labelledby="work" className="work grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="work" index={section.index} title={section.title} />

      <div className="rise col-span-full">
        <WorkTabs
          label={ui.projectTabs}
          tabs={caseStudies.map((p) => ({ id: p.slug, label: p.name }))}
          panels={caseStudies.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        />
      </div>

      <div className="col-span-full flex flex-col gap-6">
        <MonoLabel>{ui.alsoBuilt}</MonoLabel>
        <ul className="rise-group grid gap-5 md:grid-cols-2">
          {secondaryProjects.map((p) => {
            const figures = p.metrics.filter((m) => m.id !== "commits");
            return (
              <li key={p.slug} className="min-w-0">
                <InteractiveCard className="surface-card lift flex h-full flex-col gap-5 p-6 md:p-7">
                  <h3 className="font-heading text-h3 [overflow-wrap:anywhere]">{p.name}</h3>
                  <p className="text-ink-2">{p.summary.text}</p>
                  {figures.length > 0 ? (
                    <dl className="flex flex-col border-t border-hair">
                      {figures.map((m) => (
                        <div key={m.id} className="flex items-baseline gap-4 border-b border-hair py-3" title={`${ui.source}: ${m.source} (${ui.asOf} ${m.asOf})`}>
                          <dt className="order-2 flex min-w-0 flex-col gap-0.5">
                            <span className="text-small text-ink">{m.label}</span>
                            {m.qualifier ? <span className="font-mono text-mono text-ink-3">{m.qualifier}</span> : null}
                          </dt>
                          <dd className="order-1 min-w-[5.5rem] font-heading text-h3 leading-none whitespace-nowrap">
                            <CountUp display={m.display} />
                            {m.unit ? <span className="text-small text-ink-2"> {m.unit}</span> : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <ul className="flex flex-wrap gap-1.5" aria-label={ui.caseSections.stack}>
                    {p.stack.map((s) => (
                      <li key={s.name}>
                        <Chip name={s.version ? `${s.name} ${s.version}` : s.name} />
                      </li>
                    ))}
                  </ul>
                  {[...p.facts, ...p.caveats].map((f) => (
                    <p key={f.text} className="text-small text-ink-3">
                      {f.text}
                    </p>
                  ))}
                  <p className="mt-auto flex flex-wrap gap-x-6 gap-y-1 text-small">
                    {p.links.map((l) => (
                      <span key={l.href} className="inline-flex flex-wrap items-baseline gap-x-2">
                        <a href={l.href} rel="noreferrer" className="nudge inline-flex min-h-11 items-center gap-1.5 text-ink hover:text-ink-2">
                          {l.label}
                          <span className="sr-only">
                            : {p.name} ({ui.externalLink})
                          </span>
                          <span aria-hidden="true" data-arrow="out">↗</span>
                        </a>
                        {l.note ? <span className="font-mono text-mono text-ink-3">{l.note}</span> : null}
                      </span>
                    ))}
                  </p>
                </InteractiveCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
