import Link from "next/link";
import { experience } from "@/data/experience.ts";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { caseStudies, projects } from "@/data/projects.ts";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { TextLink } from "@/components/ui/text-link.tsx";
import { InView } from "@/components/motion/in-view.tsx";
import { monthYear } from "@/lib/format.ts";

/**
 * 04 / Experience. Roles and education on a vertical timeline whose rule draws
 * down as the reader scrolls (CSS view() timeline; static where unsupported or
 * under reduced motion), entries clip in once in view. Certifications are
 * listed without dates, by owner decision. The capstone stays hidden until the
 * owner describes it (experience.capstone is a TODO).
 */
export function ExperienceSection() {
  const { ui, sections } = profile;
  const t = ui.experience;
  const section = sections.find((s) => s.id === "experience")!;
  const evidence = (source: string, asOf: string) => `${ui.source}: ${source} (${ui.asOf} ${asOf})`;

  const projectLink = (slug: string) => {
    const p = projects.find((x) => x.slug === slug);
    if (!p) return null;
    if (caseStudies.includes(p)) return <Link href={`/projects/${slug}`} className="underline decoration-line-strong underline-offset-4 hover:decoration-ink">{p.name}</Link>;
    const repo = p.links.find((l) => l.kind === "repo");
    return repo ? <TextLink href={repo.href}>{p.name}</TextLink> : p.name;
  };

  return (
    <section aria-labelledby="experience" className="grid-12 gap-y-16 py-24 md:py-32">
      <SectionHeading id="experience" index={section.index} title={section.title} />

      <div className="col-span-full flex flex-col gap-6 md:col-span-10 md:col-start-2">
        <ol className="xp-timeline">
          {experience.roles.map((r) => (
            <InView as="li" key={r.id} className="xp-item clip-reveal">
              <span aria-hidden="true" className="xp-node" />
              <p className="num font-mono text-mono-lg text-ink-3 md:col-span-3">
                <time dateTime={r.start}>{monthYear(r.start)}</time> – <time dateTime={r.end}>{monthYear(r.end)}</time>
              </p>
              <div className="flex flex-col gap-3 md:col-span-7" title={evidence(r.source, r.asOf)}>
                <h3 className="font-display text-h2">{r.title}</h3>
                <p className="text-ink-2">{r.org}</p>
                <ul className="flex max-w-[64ch] flex-col gap-2">
                  {r.points.map((pt) => (
                    <li key={pt.text} className="flex gap-3 text-small text-ink-2">
                      <span aria-hidden="true" className="font-mono text-ink-3">·</span>
                      {pt.text}
                    </li>
                  ))}
                </ul>
                {r.projects.length > 0 ? (
                  <p className="font-mono text-mono text-ink-3">
                    {t.project}: {r.projects.map((slug, i) => (
                      <span key={slug} className="text-ink-2">
                        {i > 0 ? ", " : ""}
                        {projectLink(slug)}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            </InView>
          ))}
        </ol>
      </div>

      <div className="col-span-full grid gap-12 md:col-span-10 md:col-start-2 md:grid-cols-10 md:gap-6">
        <div className="flex flex-col gap-6 md:col-span-5">
          <MonoLabel>{t.education}</MonoLabel>
          <ul className="flex flex-col">
            {experience.education.map((e) => (
              <li key={e.school} className="flex flex-col gap-2 border-t border-hair py-6" title={evidence(e.source, e.asOf)}>
                <p className="font-display text-h3">{e.degree}</p>
                <p className="text-small text-ink-2">{e.school}</p>
                <p className="num font-mono text-mono text-ink-3">
                  <time dateTime={e.start}>{monthYear(e.start)}</time> – <time dateTime={e.end}>{monthYear(e.end)}</time>
                  {personal.gpa.value ? ` · ${t.gpa} ${personal.gpa.value}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-6 md:col-span-5">
          <MonoLabel>{t.certifications}</MonoLabel>
          <ul className="flex flex-col">
            {experience.certifications.map((c) => (
              <li key={c.name} className="flex flex-col gap-1 border-t border-hair py-4" title={evidence(c.source, c.asOf)}>
                <p className="text-ink">{c.name}</p>
                <p className="font-mono text-mono text-ink-3">{c.issuer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
