import Image from "next/image";
import Link from "next/link";
import { experience } from "@/data/experience.ts";
import { ossSummary, type PullRequest } from "@/data/oss.ts";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { caseStudies, projects } from "@/data/projects.ts";
import { lanes, skills } from "@/data/skills.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { Chip } from "@/components/ui/chip.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { CountUp } from "@/components/motion/count-up.tsx";
import { monthYear } from "@/lib/format.ts";

const projectName = (slug: string) => projects.find((p) => p.slug === slug)?.name ?? slug;

/**
 * 01 / About. A bento of facts drawn from the data files (education,
 * internships, open source, the flagship project), plus the owner's bio,
 * portrait, location and availability once set in personal.ts (each omitted
 * until then). Below it, the stack by lane, every chip naming where it was used.
 */
export function AboutSection({ prs }: { prs: PullRequest[] }) {
  const { ui, sections } = profile;
  const t = ui.about;
  const section = sections.find((s) => s.id === "about")!;
  const oss = ossSummary(prs);
  const school = experience.education[0]!;
  const flagship = caseStudies.find((p) => p.tier === "flagship")!;
  const flagshipMetric = flagship.metrics.find((m) => m.id === flagship.highlights[0]);
  const evidence = (source: string, asOf: string) => `${ui.source}: ${source} (${ui.asOf} ${asOf})`;

  return (
    <section aria-labelledby="about" className="grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="about" index={section.index} title={section.title} />

      <ul className="bento col-span-full md:col-span-10 md:col-start-2">
        {personal.bio.value ? (
          <li className="bento-cell md:col-span-4">
            <p className="max-w-[60ch] font-display text-h3">{personal.bio.value}</p>
          </li>
        ) : null}
        {personal.portrait.value ? (
          <li className="bento-cell md:col-span-2 md:row-span-2 p-0!">
            <Image src={personal.portrait.value} alt="" width={600} height={750} className="shot size-full object-cover" sizes="(min-width: 768px) 30vw, 100vw" />
          </li>
        ) : null}

        <li className="bento-cell md:col-span-3" title={evidence(school.source, school.asOf)}>
          <MonoLabel>{t.education}</MonoLabel>
          <p className="font-display text-h3">{school.degree}</p>
          <p className="text-small text-ink-2">{school.school}</p>
          <p className="num font-mono text-mono text-ink-3">
            {monthYear(school.start)} – {monthYear(school.end)}
          </p>
        </li>

        <li className="bento-cell md:col-span-3" title={evidence(oss.source, oss.asOf)}>
          <MonoLabel>{t.openSource}</MonoLabel>
          <p className="font-display text-h2 leading-none">
            <CountUp display={String(oss.merged)} />
          </p>
          <p className="text-small text-ink-2">
            {t.mergedPrs} {t.acrossProjects} <span className="num">{oss.mergedProjects}</span> {ui.oss.acrossProjects},{" "}
            <span className="num">{oss.open}</span> {ui.oss.underReview}
          </p>
          <a href="#open-source" className="mt-auto font-mono text-mono text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
            {sections.find((s) => s.id === "open-source")!.index} / {sections.find((s) => s.id === "open-source")!.title} <span aria-hidden="true">↓</span>
          </a>
        </li>

        <li className="bento-cell md:col-span-2">
          <MonoLabel>{t.internships}</MonoLabel>
          <p className="font-display text-h2 leading-none">
            <CountUp display={String(experience.roles.length)} />
          </p>
          <ul className="flex flex-col gap-1 text-small text-ink-2">
            {experience.roles.map((r) => (
              <li key={r.id} title={evidence(r.source, r.asOf)}>
                {r.org} <span className="num font-mono text-mono text-ink-3">{r.start.slice(0, 4)}</span>
              </li>
            ))}
          </ul>
        </li>

        <li className="bento-cell md:col-span-4" title={evidence(flagship.summary.source, flagship.summary.asOf)}>
          <MonoLabel>{t.flagship}</MonoLabel>
          <p className="font-display text-h3">{flagship.name}</p>
          <p className="max-w-[56ch] text-small text-ink-2">{flagship.summary.text}</p>
          {flagshipMetric ? (
            <p className="text-small text-ink-2" title={evidence(flagshipMetric.source, flagshipMetric.asOf)}>
              <span className="num font-display text-h3 text-ink">{flagshipMetric.display}</span>{" "}
              {flagshipMetric.label}
              {flagshipMetric.qualifier ? ` · ${flagshipMetric.qualifier}` : ""}
            </p>
          ) : null}
          <Link href={`/projects/${flagship.slug}`} className="mt-auto font-mono text-mono text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink">
            {ui.caseStudy} <span aria-hidden="true">→</span>
          </Link>
        </li>

        {personal.location.value || personal.availability.value ? (
          <li className="bento-cell md:col-span-2">
            {personal.location.value ? (
              <>
                <MonoLabel>{t.location}</MonoLabel>
                <p className="text-ink">{personal.location.value}</p>
              </>
            ) : null}
            {personal.availability.value ? (
              <>
                <MonoLabel>{t.availability}</MonoLabel>
                <p className="text-ink">{personal.availability.value}</p>
              </>
            ) : null}
          </li>
        ) : null}
      </ul>

      <div className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
        <MonoLabel>{t.stack}</MonoLabel>
        <dl className="flex flex-col">
          {lanes.map((lane) => {
            const chips = skills.filter((s) => s.lane === lane);
            if (chips.length === 0) return null;
            return (
              <div key={lane} className="grid gap-4 border-t border-hair py-6 md:grid-cols-10 md:gap-6">
                <dt className="font-display text-h3 md:col-span-3">{t.lanes[lane]}</dt>
                <dd className="md:col-span-7">
                  <ul className="flex flex-wrap gap-x-5 gap-y-3">
                    {chips.map((c) => (
                      <li key={c.name} className="flex flex-col items-start gap-1" title={evidence(c.source, c.asOf)}>
                        <Chip name={c.name} qualifier={c.qualifier} />
                        <span className="font-mono text-mono text-ink-3">
                          <span className="sr-only">{t.usedIn}: </span>
                          {c.qualifier ? c.usedIn.join(", ") : c.usedIn.map(projectName).join(", ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
