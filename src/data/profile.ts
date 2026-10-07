import { z } from "zod";
import { claim } from "./schema.ts";

/**
 * Site-wide copy: hero, section indices, CTAs, footer microcopy.
 * Source "owner:approved-copy" means the line was approved by the owner in the
 * build brief (2026-10-06) and is logged in FACTS-CHECK.md.
 */

const sectionSchema = z.object({
  id: z.string().regex(/^[a-z-]+$/),
  index: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  /** Rendered on `/` yet? Nav links and CTAs point only at live sections. */
  live: z.boolean(),
});

const profileSchema = z.object({
  hero: z.object({
    /** The final period is the one place body/heading text may use --break. */
    headline: claim,
    sub: claim,
    ctaPrimary: z.object({ label: z.string(), href: z.string().startsWith("#") }),
    ctaResume: z.object({ label: z.string() }),
  }),
  sections: z.array(sectionSchema).min(1),
  meta: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(160),
  }),
  /** Interface strings: controls and accessible names, not claims. */
  ui: z.object({
    skipToContent: z.string(),
    navLabel: z.string(),
    pauseAnimations: z.string(),
    playAnimations: z.string(),
    themeToLight: z.string(),
    themeToDark: z.string(),
    resumeUnavailable: z.string(),
    statusMerged: z.string(),
    statusOpen: z.string(),
    externalLink: z.string(),
    caseStudy: z.string(),
    alsoBuilt: z.string(),
    stackAcross: z.string(),
    carouselLabel: z.string(),
    previous: z.string(),
    next: z.string(),
    slideOf: z.string(),
    zoom: z.string(),
    close: z.string(),
    source: z.string(),
    asOf: z.string(),
    back: z.string(),
    cursorView: z.string(),
    cursorZoom: z.string(),
    chartConfiguration: z.string(),
    chartNote: z.string(),
    caseSections: z.object({
      problem: z.string(),
      architecture: z.string(),
      decisions: z.string(),
      evidence: z.string(),
      stack: z.string(),
      caveats: z.string(),
      screenshots: z.string(),
    }),
    diagram: z.object({
      play: z.string(),
      pause: z.string(),
      step: z.string(),
      restart: z.string(),
      scrub: z.string(),
      steps: z.string(),
    }),
  }),
});

export const profile = profileSchema.parse({
  hero: {
    headline: {
      text: "Backend systems that stay correct under load.",
      source: "owner:approved-copy",
      asOf: "2026-10-06",
    },
    sub: {
      text: "Software Engineering student at AASTMT (Jun 2027). Java and Spring Boot, Redis, RabbitMQ, plus Python AI services and open-source work.",
      source: "owner:approved-copy",
      asOf: "2026-10-06",
    },
    ctaPrimary: { label: "View My Work", href: "#work" },
    ctaResume: { label: "Download Resume" },
  },
  sections: [
    { live: false, id: "about", index: "01", title: "About" },
    { live: true, id: "work", index: "02", title: "Work" },
    { live: false, id: "open-source", index: "03", title: "Open source" },
    { live: false, id: "experience", index: "04", title: "Experience" },
    { live: false, id: "contact", index: "05", title: "Contact" },
  ],
  meta: {
    title: "Sharawey74 / Backend systems",
    description:
      "Backend systems in Java and Spring Boot, Python AI services, and open-source pull requests. Every number links to its source.",
  },
  ui: {
    skipToContent: "Skip to content",
    navLabel: "Sections",
    pauseAnimations: "Pause animations",
    playAnimations: "Play animations",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    resumeUnavailable: "Resume coming soon",
    statusMerged: "Merged",
    statusOpen: "Open",
    externalLink: "opens an external site",
    caseStudy: "Case study",
    alsoBuilt: "Also built",
    stackAcross: "Stack across these projects",
    carouselLabel: "Screenshots",
    previous: "Previous screenshot",
    next: "Next screenshot",
    slideOf: "of",
    zoom: "Open full-size screenshot",
    close: "Close",
    source: "Source",
    asOf: "as of",
    back: "All work",
    cursorView: "View",
    cursorZoom: "Zoom",
    chartConfiguration: "Configuration",
    chartNote: "Note",
    caseSections: {
      problem: "Problem",
      architecture: "Architecture",
      decisions: "Key decisions",
      evidence: "Evidence",
      stack: "Stack",
      caveats: "Limits",
      screenshots: "Screenshots",
    },
    diagram: {
      play: "Play",
      pause: "Pause",
      step: "Step",
      restart: "Restart",
      scrub: "Follow scroll",
      steps: "Steps",
    },
  },
});

export type Profile = typeof profile;
