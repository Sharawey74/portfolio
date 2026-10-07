/**
 * Canonical site origin for metadata, sitemap, robots and JSON-LD.
 * NEXT_PUBLIC_SITE_URL wins (set it to the custom domain once there is one);
 * on Vercel, the project's production domain is the fallback; locally, the
 * dev server.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
