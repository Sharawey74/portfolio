import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { experience } from "@/data/experience.ts";
import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { skills } from "@/data/skills.ts";
import { siteUrl } from "@/lib/site.ts";
import { fontVariables } from "@/styles/fonts.ts";
import { ThemeScript } from "@/components/theme/theme-script.tsx";
import { SmoothScroll } from "@/components/motion/smooth-scroll.tsx";
import { Cursor } from "@/components/motion/cursor.tsx";
import { SiteHeader } from "@/components/layout/site-header.tsx";
import { Intro } from "@/components/intro/intro.tsx";
import { SiteFooter } from "@/components/layout/site-footer.tsx";
import { Surfaces } from "@/components/layout/surfaces.tsx";
import { CommandPalette } from "@/components/palette/command-palette.tsx";
import { ScrambleHost } from "@/components/motion/scramble.tsx";
import "@/styles/globals.css";

const siteName = personal.name.value ?? personal.github.handle;

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: profile.meta.title, template: `%s / ${siteName}` },
  description: profile.meta.description,
  openGraph: { type: "website", siteName, title: profile.meta.title, description: profile.meta.description },
  twitter: { card: "summary_large_image", title: profile.meta.title, description: profile.meta.description },
};

/** JSON-LD Person. The name falls back to the handle until the owner sets it. */
function personJsonLd() {
  const school = experience.education[0];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    alternateName: personal.github.handle,
    url: siteUrl().href,
    ...(personal.email.value ? { email: `mailto:${personal.email.value}` } : {}),
    ...(personal.location.value ? { address: { "@type": "PostalAddress", addressLocality: personal.location.value } } : {}),
    sameAs: [personal.github.href, personal.linkedin.href],
    ...(school ? { alumniOf: { "@type": "CollegeOrUniversity", name: school.school } } : {}),
    knowsAbout: skills.filter((s) => s.lane === "backend" || s.lane === "data").map((s) => s.name),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme and data-motion are set before paint by ThemeScript.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <ThemeScript />
      </head>
      <body>
        <a href="#main" className="skip-link mono-label">
          {profile.ui.skipToContent}
        </a>
        <SmoothScroll>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="pt-(--header-h) outline-none">
            {children}
          </main>
          <SiteFooter />
          <CommandPalette />
        </SmoothScroll>
        <Surfaces />
        <Intro />
        <Cursor />
        <ScrambleHost />
        <script
          type="application/ld+json"
          // Built from the typed data files; "<" is escaped so no value can close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
