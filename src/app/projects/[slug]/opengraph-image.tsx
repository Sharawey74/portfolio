import { caseStudies, getProject } from "@/data/projects.ts";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { OG_SIZE, renderOg } from "@/lib/og.tsx";

export const alt = profile.ui.caseStudy;
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug)!;
  const handle = (personal.name.value ?? personal.github.handle).toUpperCase();
  return renderOg({
    kicker: `${handle} / ${profile.ui.caseStudy.toUpperCase()} / ${p.name.toUpperCase()}`,
    title: p.summary.text,
    footer: p.stack
      .slice(0, 5)
      .map((s) => s.name)
      .join(" · "),
  });
}
