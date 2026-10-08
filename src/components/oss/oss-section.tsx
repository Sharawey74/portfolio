import { issueUrl, oss, ossSummary, prUrl, type PullRequest } from "@/data/oss.ts";
import { profile } from "@/data/profile.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { StatusPill } from "@/components/ui/status-pill.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { TextLink } from "@/components/ui/text-link.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { InView } from "@/components/motion/in-view.tsx";
import { dayMonthYear, monthYear } from "@/lib/format.ts";

/**
 * 03 / Open source. Headline numbers derive from the list (ossSummary), then
 * a timeline of pull requests, newest first, grouped by month. Status is shown
 * by shape (StatusPill and the timeline node), never by color alone. `prs`
 * comes from the daily GitHub refresh, or the committed snapshot on failure.
 */
export function OssSection({ prs, live }: { prs: PullRequest[]; live: boolean }) {
  const { ui, sections } = profile;
  const t = ui.oss;
  const section = sections.find((s) => s.id === "open-source")!;
  const s = ossSummary(prs);
  const sorted = [...prs].sort((a, b) => (b.mergedAt ?? b.createdAt).localeCompare(a.mergedAt ?? a.createdAt));
  const months = [...new Set(sorted.map((p) => (p.mergedAt ?? p.createdAt).slice(0, 7)))];

  return (
    <section aria-labelledby="open-source" className="grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="open-source" index={section.index} title={section.title} />

      <div className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-hair pt-8 md:grid-cols-4" title={`${ui.source}: ${s.source} (${ui.asOf} ${s.asOf})`}>
          <div className="flex flex-col gap-1">
            <dt className="mono-label order-2 text-ink-3">{t.merged}</dt>
            <dd className="order-1 font-display text-display-l leading-none">
              <CountUp display={String(s.merged)} />
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="mono-label order-2 text-ink-3">{t.acrossProjects}</dt>
            <dd className="order-1 font-display text-display-l leading-none">
              <CountUp display={String(s.mergedProjects)} />
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="mono-label order-2 text-ink-3">{t.underReview}</dt>
            <dd className="order-1 font-display text-display-l leading-none">
              <CountUp display={String(s.open)} />
            </dd>
          </div>
          <div className="flex flex-col justify-end gap-1">
            <dd className="num font-mono text-mono-lg text-ink-2">
              {s.from ? monthYear(s.from) : ""} – {s.to ? monthYear(s.to) : ""}
            </dd>
            <dt className="mono-label text-ink-3">{live ? t.liveStatus : `${t.snapshotStatus} (${dayMonthYear(oss.fetchedAt)})`}</dt>
          </div>
        </dl>
      </div>

      <ol className="oss-timeline col-span-full md:col-span-10 md:col-start-2">
        {months.map((m) => (
          <li key={m} className="oss-month">
            <h3 className="oss-month-label mono-label text-ink-3">
              <time dateTime={m}>{monthYear(m)}</time>
            </h3>
            <ul className="flex flex-col">
              {sorted
                .filter((p) => (p.mergedAt ?? p.createdAt).startsWith(m))
                .map((p) => (
                  <InView as="li" key={`${p.repo}#${p.number}`} className="oss-item clip-reveal" >
                    <span aria-hidden="true" className="oss-node" data-state={p.state} />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <StatusPill status={p.state} />
                      <span className="font-mono text-mono text-ink-2">{p.repo}</span>
                    </div>
                    <p className="text-body text-ink">
                      <TextLink href={prUrl(p)}>
                        <span className="num font-mono text-mono">#{p.number}</span> {p.title}
                      </TextLink>
                    </p>
                    <p className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-mono text-ink-3">
                      <span className="num">
                        {p.mergedAt ? `${t.mergedOn} ${dayMonthYear(p.mergedAt)}` : `${t.opened} ${dayMonthYear(p.createdAt)}`}
                      </span>
                      <span className="num">
                        +{p.additions} / −{p.deletions} {t.lines}
                      </span>
                      {p.fixes ? (
                        <span>
                          {t.fixes}{" "}
                          <a href={issueUrl(p.repo, p.fixes)} className="num underline decoration-line-strong underline-offset-4 hover:text-ink">
                            #{p.fixes}
                          </a>
                        </span>
                      ) : null}
                    </p>
                    {p.note ? <p className="text-small text-ink-2">{p.note}</p> : null}
                  </InView>
                ))}
            </ul>
          </li>
        ))}
      </ol>

      {oss.issues.length > 0 ? (
        <div className="col-span-full flex flex-col gap-4 md:col-span-10 md:col-start-2">
          <MonoLabel>{t.issues}</MonoLabel>
          <ul className="flex flex-col">
            {oss.issues.map((i) => (
              <li key={`${i.repo}#${i.number}`} className="flex flex-col gap-1 border-t border-hair py-4">
                <p>
                  <TextLink href={issueUrl(i.repo, i.number)}>
                    <span className="num font-mono text-mono">
                      {i.repo}#{i.number}
                    </span>{" "}
                    {i.title}
                  </TextLink>
                </p>
                <p className="font-mono text-mono text-ink-3">
                  <span aria-hidden="true">{i.state === "closed" ? "● " : "○ "}</span>
                  {i.state === "closed" ? t.closed : ui.statusOpen} · {i.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
