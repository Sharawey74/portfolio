import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site.ts";

/** Crawl everything except the dev specimen; preview deployments are noindex via Vercel's own header. */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dev/" },
    sitemap: new URL("/sitemap.xml", base).href,
  };
}
