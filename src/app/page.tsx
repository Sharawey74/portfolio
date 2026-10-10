import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero.tsx";
import { AboutSection } from "@/components/about/about-section.tsx";
import { WorkSection } from "@/components/work/work-section.tsx";
import { OssSection } from "@/components/oss/oss-section.tsx";
import { ExperienceSection } from "@/components/experience/experience-section.tsx";
import { FigureGrid } from "@/components/figures/figure-grid.tsx";
import { Closing } from "@/components/contact/closing.tsx";
import { ContactSection } from "@/components/contact/contact-section.tsx";
import { getPullRequests } from "@/lib/oss-live.ts";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home: hero, then the five numbered sections, each flagged `live` in
 * profile.ts, with two unnumbered blocks before Contact (Stage 7): the
 * figure grid and the closing line. Pull-request status is fetched once
 * (daily ISR, snapshot fallback) and shared by the hero pill, About, Open
 * source and the figure grid so their numbers agree.
 */
export default async function Home() {
  const { prs, live } = await getPullRequests();
  return (
    <>
      <Hero prs={prs} />
      <AboutSection prs={prs} />
      <WorkSection />
      <OssSection prs={prs} live={live} />
      <ExperienceSection />
      <FigureGrid prs={prs} />
      <Closing />
      <ContactSection />
    </>
  );
}
