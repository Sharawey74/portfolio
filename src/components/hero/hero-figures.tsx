import { profile } from "@/data/profile.ts";
import { getProject } from "@/data/projects.ts";
import { CountUp } from "@/components/motion/count-up.tsx";

/**
 * The figures strip under the hero: metric ids listed in profile.hero.figures,
 * resolved from projects.ts, so each figure keeps its label, qualifier and
 * source. Numbers count up once in view (M10, CountUp); the server HTML holds
 * the final values. A missing id fails the build rather than rendering blank.
 */
export function HeroFigures() {
  const figures = profile.hero.figures.map(({ project, metric }) => {
    const p = getProject(project);
    const m = p?.metrics.find((x) => x.id === metric);
    if (!p || !m) throw new Error(`hero figure ${project}/${metric} not found in projects.ts`);
    return { key: `${project}-${metric}`, project: p.name, ...m };
  });

  return (
    <dl className="hero-figures col-span-full grid grid-cols-2 border-t border-line lg:grid-cols-4">
      {figures.map((f) => (
        <div key={f.key} className="flex flex-col gap-1.5 pt-6 pr-6 pb-2">
          <dt className="order-2 text-small text-ink">{f.label}</dt>
          <dd className="order-1 font-heading text-h2 leading-none tracking-tight">
            <CountUp display={f.display} />
            {f.unit ? <span className="text-body text-ink-2"> {f.unit}</span> : null}
          </dd>
          <dd className="order-3 font-mono text-mono text-ink-3">
            {f.project}
            {f.qualifier ? ` · ${f.qualifier}` : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
