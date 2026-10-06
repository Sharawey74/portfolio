import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { profile } from "@/data/profile.ts";
import { fontVariables } from "@/styles/fonts.ts";
import { ThemeScript } from "@/components/theme/theme-script.tsx";
import { SmoothScroll } from "@/components/motion/smooth-scroll.tsx";
import { Cursor } from "@/components/motion/cursor.tsx";
import { SiteHeader } from "@/components/layout/site-header.tsx";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: profile.meta.title,
  description: profile.meta.description,
};

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
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
