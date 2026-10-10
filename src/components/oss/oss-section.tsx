import { issueUrl, oss, ossSummary, prUrl, type PullRequest } from "@/data/oss.ts";
import { profile } from "@/data/profile.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { StatusPill } from "@/components/ui/status-pill.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { dayMonthYear, monthYear } from "@/lib/format.ts";
import { OssFilter } from "./oss-filter.tsx";

/**
 * 03 / Open source. Pull requests as status rows in one card, newest first,
 * with an All / Merged / Open filter (Stage 7, docs/ISSUES.md ISS-42). The
 * counts derive from the list (ossSummary), and status is shown by shape
 * (StatusPill: filled + ✓ or outline + ○ and the break dot), never by color
 * alone. `prs` comes from the daily GitHub refresh, or the committed snapshot
 * on failure. Reported issues follow as a second card.
 */
export function OssSection({ prs, live }: { prs: PullRequest[]; live: boolean }) {
  const { ui, sections } = profile;
  const t = ui.oss;
  const section = sections.find((s) => s.id === "open-source")!;
  const s = ossSummary(prs);
  const sorted = [...prs].sort((a, b) => (b.mergedAt ?? b.createdAt).localeCompare(a.mergedAt ?? a.createdAt));

  const rows = sorted.map((p) => (
    <li key={`${p.repo}#${p.number}`} className="oss-row">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="num font-mono text-mono wrap-anywhere text-ink-3">
          {p.repo} #{p.number} · {p.mergedAt ? `${t.mergedOn} ${dayMonthYear(p.mergedAt)}` : `${t.opened} ${dayMonthYear(p.createdAt)}`} · +{p.additions} / −{p.deletions} {t.lines}
        </p>
        <a href={prUrl(p)} rel="noreferrer" className="nudge text-body text-ink hover:text-ink-2">
          {p.title}
          <span className="sr-only"> ({ui.externalLink})</span> <span aria-hidden="true" data-arrow="out" className="text-ink-3">↗</span>
        </a>
        {p.fixes || p.note ? (
          <p className="text-small text-ink-2">
            {p.fixes ? (
              <>
                {t.fixes}{" "}
                <a href={issueUrl(p.repo, p.fixes)} rel="noreferrer" className="num underline decoration-line-strong underline-offset-4 hover:text-ink">
                  #{p.fixes}
                </a>
                {p.note ? ". " : ""}
              </>
            ) : null}
            {p.note}
          </p>
        ) : null}
      </div>
      <div className="oss-row-status">
        <StatusPill status={p.state} />
      </div>
    </li>
  ));

  return (
    <section aria-labelledby="open-source" className="grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="open-source" index={section.index} title={section.title} />

      <div className="col-span-full flex flex-col gap-3 md:col-span-10 md:col-start-2" title={`${ui.source}: ${s.source} (${ui.asOf} ${s.asOf})`}>
        <OssFilter
          label={t.filter}
          labels={{ all: t.all, merged: ui.statusMerged, open: ui.statusOpen }}
          showing={t.showing}
          of={ui.slideOf}
          states={sorted.map((p) => p.state)}
          rows={rows}
        />
        <p className="num font-mono text-mono text-ink-3">
          {live ? t.liveStatus : `${t.snapshotStatus} (${dayMonthYear(oss.fetchedAt)})`} · {s.from ? monthYear(s.from) : ""} – {s.to ? monthYear(s.to) : ""}
        </p>
      </div>

      {oss.issues.length > 0 ? (
        <div className="col-span-full flex flex-col gap-4 md:col-span-10 md:col-start-2">
          <MonoLabel>{t.issues}</MonoLabel>
          <ul className="surface-card overflow-clip">
            {oss.issues.map((i) => (
              <li key={`${i.repo}#${i.number}`} className="oss-row">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="num font-mono text-mono wrap-anywhere text-ink-3">
                    {i.repo} #{i.number}
                  </p>
                  <a href={issueUrl(i.repo, i.number)} rel="noreferrer" className="nudge text-body text-ink hover:text-ink-2">
                    {i.title}
                    <span className="sr-only"> ({ui.externalLink})</span> <span aria-hidden="true" data-arrow="out" className="text-ink-3">↗</span>
                  </a>
                  <p className="text-small text-ink-2">{i.note}</p>
                </div>
                <p className="oss-row-status font-mono text-mono text-ink-2">
                  <span aria-hidden="true">{i.state === "closed" ? "● " : "○ "}</span>
                  {i.state === "closed" ? t.closed : ui.statusOpen}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
