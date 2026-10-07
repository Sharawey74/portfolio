import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/projects.ts";
import { siteUrl } from "@/lib/site.ts";

/** Home plus every case study. `/dev/*` is excluded (noindex, 404 in production). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: new URL("/", base).href, changeFrequency: "weekly", priority: 1 },
    ...caseStudies.map((p) => ({
      url: new URL(`/projects/${p.slug}`, base).href,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
