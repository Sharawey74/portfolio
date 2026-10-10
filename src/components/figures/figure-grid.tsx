import { ossSummary, type PullRequest } from "@/data/oss.ts";
import { profile } from "@/data/profile.ts";
import { getProject } from "@/data/projects.ts";
import { CountUp } from "@/components/motion/count-up.tsx";
import { RevealText } from "@/components/motion/reveal-text.tsx";
import { sourceHref } from "@/lib/sources.ts";

/**
 * "Every figure has a source." (Stage 7, docs/ISSUES.md ISS-42): a 3 × 3
 * grid of metric ids listed in profile.figures, resolved from projects.ts so
 * each keeps its label, qualifier, source and date, plus the derived
 * open-source count (ossSummary over the page's PR list). Each source links to
 * the pinned GitHub lines when public. A missing id fails the build.
 * Not a numbered section: it sits between Experience and the closing line.
 */
export function FigureGrid({ prs }: { prs: PullRequest[] }) {
  const { ui, figures } = profile;
  const t = ui.oss;
  const items = figures.items.map((item) => {
    if ("oss" in item) {
      const s = ossSummary(prs);
      return {
        key: "oss-merged",
        display: String(s.merged),
        unit: undefined,
        label: t.merged,
        context: `${s.mergedProjects} ${t.acrossProjects}, ${s.open} ${t.underReview}`,
        source: s.source,
        asOf: s.asOf,
      };
    }
    const p = getProject(item.project);
    const m = p?.metrics.find((x) => x.id === item.metric);
    if (!p || !m) throw new Error(`figure ${item.project}/${item.metric} not found in projects.ts`);
    return {
      key: `${item.project}-${item.metric}`,
      display: m.display,
      unit: m.unit,
      label: m.label,
      context: m.qualifier ? `${p.name} · ${m.qualifier}` : p.name,
      source: m.source,
      asOf: m.asOf,
    };
  });

  return (
    <section aria-labelledby="figures" className="grid-12 gap-y-12 py-24 md:py-32">
      <RevealText as="h2" id="figures" text={figures.title.text} className="col-span-full max-w-[18ch] font-heading text-section text-gradient md:col-span-10 md:col-start-2" />
      <dl className="figure-grid rise col-span-full md:col-span-10 md:col-start-2">
        {items.map((f) => {
          const href = sourceHref(f.source);
          return (
            <div key={f.key} className="figure-cell">
              <dt className="order-2 text-body text-ink">{f.label}</dt>
              <dd className="order-1 font-heading text-h2 leading-none tracking-tight whitespace-nowrap">
                <CountUp display={f.display} />
                {f.unit ? <span className="text-body text-ink-2"> {f.unit}</span> : null}
              </dd>
              <dd className="order-3 text-small text-ink-2">{f.context}</dd>
              <dd className="order-4 mt-auto pt-2 font-mono text-mono wrap-anywhere text-ink-3">
                {href ? (
                  <a href={href} rel="noreferrer" className="nudge underline decoration-line underline-offset-2 hover:text-ink">
                    {f.source}
                    <span className="sr-only"> ({ui.externalLink})</span>
                    <span aria-hidden="true" data-arrow="out">
                      {" "}↗
                    </span>
                  </a>
                ) : (
                  f.source
                )}{" "}
                · {ui.asOf} <time dateTime={f.asOf}>{f.asOf}</time>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
