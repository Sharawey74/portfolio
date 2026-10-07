import type { CSSProperties } from "react";
import { caseStudies, secondaryProjects } from "@/data/projects.ts";
import { profile } from "@/data/profile.ts";
import { skills } from "@/data/skills.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { Chip } from "@/components/ui/chip.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { TextLink } from "@/components/ui/text-link.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { Marquee } from "./marquee.tsx";
import { ProjectCard } from "./project-card.tsx";
import { StackFallback } from "./stack-fallback.tsx";

/**
 * 02 / Work. Featured projects as a sticky stack (M6: each card scales and
 * dims as the next arrives, CSS view() timeline, Lenis fallback), the stack
 * marquee, then the secondary projects as hairline rows (no case study).
 */
export function WorkSection() {
  const { ui, sections } = profile;
  const section = sections.find((s) => s.id === "work")!;

  return (
    <section aria-labelledby="work" className="work grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="work" index={section.index} title={section.title} />

      <ol className="stack col-span-full" style={{ "--n": caseStudies.length } as CSSProperties}>
        {caseStudies.map((p, i) => (
          <li key={p.slug} className="stack-item" style={{ "--i": i } as CSSProperties}>
            <ProjectCard project={p} index={i} />
          </li>
        ))}
      </ol>
      <StackFallback />

      <div className="col-span-full flex flex-col gap-4">
        <MonoLabel>{ui.stackAcross}</MonoLabel>
        <Marquee label={ui.stackAcross}>
          {skills.map((s) => (
            <li key={s.name}>
              <Chip name={s.name} qualifier={s.qualifier} />
            </li>
          ))}
        </Marquee>
      </div>

      <div className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
        <MonoLabel>{ui.alsoBuilt}</MonoLabel>
        <ul className="flex flex-col">
          {secondaryProjects.map((p) => (
            <li key={p.slug} className="grid gap-4 border-t border-hair py-8 md:grid-cols-10 md:gap-6">
              <h3 className="font-display text-h2 md:col-span-3">{p.name}</h3>
              <div className="flex flex-col gap-3 md:col-span-4">
                <p className="text-ink-2">{p.summary.text}</p>
                {p.facts.map((f) => (
                  <p key={f.text} className="text-small text-ink-3">
                    {f.text}
                  </p>
                ))}
                {p.caveats.map((c) => (
                  <p key={c.text} className="text-small text-ink-3">
                    {c.text}
                  </p>
                ))}
                <p className="flex flex-wrap gap-x-5 gap-y-1 text-small">
                  {p.links.map((l) => (
                    <span key={l.href}>
                      <TextLink href={l.href}>{l.label}</TextLink>
                      {l.note ? <span className="ml-2 font-mono text-mono text-ink-3">{l.note}</span> : null}
                    </span>
                  ))}
                </p>
              </div>
              <dl className="flex flex-col gap-4 md:col-span-3">
                {p.metrics
                  .filter((m) => m.id !== "commits")
                  .map((m) => (
                    <div key={m.id} className="flex flex-col gap-1" title={`${ui.source}: ${m.source} (${ui.asOf} ${m.asOf})`}>
                      <dt className="mono-label order-2 text-ink-3">
                        {m.label}
                        {m.qualifier ? ` · ${m.qualifier}` : ""}
                      </dt>
                      <dd className="order-1 font-display text-h2 leading-none">
                        <CountUp display={m.display} />
                        {m.unit ? <span className="ml-1 font-mono text-mono text-ink-3">{m.unit}</span> : null}
                      </dd>
                    </div>
                  ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
