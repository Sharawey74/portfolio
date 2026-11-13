import { profile } from "@/data/profile.ts";
import { projects } from "@/data/projects.ts";
import { laneProjects, lanes, skills } from "@/data/skills.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { TraceLight } from "@/components/motion/trace-light.tsx";
import { StackPicker } from "./stack-picker.tsx";

const projectName = (slug: string) => projects.find((p) => p.slug === slug)?.name ?? slug;

/**
 * Stack (layout "trace", docs/ISSUES.md ISS-55; replaces the table in About).
 * The lanes branch off one rail into two columns, every technology with a
 * dot and where it was used. The rail draws as the reader scrolls (CSS view
 * timeline), each node lights once it is reached (TraceLight), and a lane's
 * node is a button that lights the projects using it on the timeline below.
 * Only components and chips from skills.ts appear (honesty rule 4).
 */
export function StackSection() {
  const { ui, sections } = profile;
  const t = ui.stack;
  const section = sections.find((s) => s.id === "stack")!;
  const evidence = (source: string, asOf: string) => `${ui.source}: ${source} (${ui.asOf} ${asOf})`;
  const shown = lanes.filter((l) => skills.some((s) => s.lane === l));
  // Balance the two columns: each lane goes to the shorter one so far
  // (a lane's height is about its chip count plus its title and links).
  const height = { l: 0, r: 0 };
  const sides = shown.map((l) => {
    const side = height.l <= height.r ? "l" : "r";
    height[side] += skills.filter((s) => s.lane === l).length + 2;
    return side;
  });

  const units = shown.map((lane) => {
    const used = laneProjects(lane);
    return (
      <>
        <h3 className="font-heading text-h3">{ui.about.lanes[lane]}</h3>
        <ul className="tree-skills">
          {skills
            .filter((s) => s.lane === lane)
            .map((c) => (
              <li key={c.name} title={evidence(c.source, c.asOf)}>
                <span className="tree-dot" data-node="" aria-hidden="true" />
                <span className="tree-skill">
                  <span className="text-ink">
                    {c.name}
                    {c.qualifier ? <span className="font-mono text-mono text-ink-3"> ({c.qualifier})</span> : null}
                  </span>
                  <span className="text-small text-ink-3">
                    <span className="sr-only">{t.usedIn}: </span>
                    {c.qualifier ? c.usedIn.join(", ") : c.usedIn.map(projectName).join(", ")}
                  </span>
                </span>
              </li>
            ))}
        </ul>
        {used.length > 0 ? (
          <p className="tree-used">
            <span className="mono-label text-ink-3">{t.usedIn}</span>
            {used.map((slug) => (
              <a key={slug} href={`#project-${slug}`} className="nudge inline-flex min-h-11 items-center gap-1 text-small text-ink-2 hover:text-ink">
                <span className="sr-only">{t.jump} </span>
                {projectName(slug)}
                <span aria-hidden="true" data-arrow="down">↓</span>
              </a>
            ))}
          </p>
        ) : null}
      </>
    );
  });

  return (
    <section aria-labelledby="stack" className="grid-12 gap-y-12 py-24 md:py-32">
      <SectionHeading id="stack" index={section.index} title={section.title} />
      <p className="col-span-full max-w-[60ch] text-ink-2 md:col-span-8 md:col-start-2">{t.lead}</p>
      <TraceLight className="col-span-full md:col-span-10 md:col-start-2">
        <StackPicker
          label={section.title}
          highlight={t.highlight}
          announce={t.announce}
          cleared={t.cleared}
          lanes={shown.map((l, i) => ({ id: l, name: ui.about.lanes[l], projects: laneProjects(l).map(projectName), side: sides[i]! }))}
          units={units}
        />
      </TraceLight>
    </section>
  );
}
