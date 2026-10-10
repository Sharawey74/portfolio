import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Dark-theme tokens read from globals.css, so the image cannot drift from the site. */
async function tokens() {
  const css = await readFile(join(process.cwd(), "src/styles/globals.css"), "utf8");
  const dark = css.slice(css.indexOf("/* tokens:dark */"), css.indexOf("/* tokens:end */"));
  const get = (name: string) => {
    const m = dark.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
    if (!m) throw new Error(`og: ${name} not found in the dark tokens`);
    return m[1]!;
  };
  return { page: get("--g0"), line: get("--g5"), text3: get("--g8"), text: get("--g11"), accent: get("--break") };
}

/**
 * Static TTF subset from Google Fonts (the same fonts next/font serves).
 * Satori needs TTF/OTF; without a browser user agent the CSS API returns
 * TrueType. `text` limits the file to the glyphs used. next/og's bundled
 * default is a banned face, so a failed fetch fails the build.
 */
async function googleFont(family: string, axes: string, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:${axes}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!src) throw new Error(`og: no TrueType source for ${family}`);
  return (await fetch(src)).arrayBuffer();
}

/**
 * Black-and-white share card: a small kicker, a display title whose final
 * period may take the break color (as on the site), and a small footer line.
 * The small lines use Instrument Sans, the site's heading face: the site's
 * mono (Commit Mono) is self-hosted and not on Google Fonts.
 */
export async function renderOg({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const c = await tokens();
  const endsWithPeriod = title.endsWith(".");
  // Satori lays out each child as a flex item, so words are separate items and
  // the final period rides inside the last word (it never wraps alone).
  const words = (endsWithPeriod ? title.slice(0, -1) : title).split(" ");
  const fontSize = title.length > 60 ? 72 : title.length > 40 ? 88 : 112;
  const [display, small] = await Promise.all([
    googleFont("Newsreader", "opsz,wght@72,400", title),
    googleFont("Instrument+Sans", "wght@400", `${kicker}${footer}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: c.page,
          color: c.text,
        }}
      >
        <div style={{ display: "flex", fontFamily: "Mono", fontSize: 22, letterSpacing: "0.06em", color: c.text3 }}>{kicker}</div>
        <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Display", fontSize, lineHeight: 1.02, letterSpacing: "-0.03em", maxWidth: 1056 }}>
          {words.map((w, i) => (
            <span key={i} style={{ display: "flex", marginRight: i < words.length - 1 ? "0.24em" : 0 }}>
              {w}
              {endsWithPeriod && i === words.length - 1 ? <span style={{ color: c.accent }}>.</span> : null}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", borderTop: `1px solid ${c.line}`, paddingTop: 24, fontFamily: "Mono", fontSize: 20, color: c.text3 }}>{footer}</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Display", data: display, weight: 400, style: "normal" },
        { name: "Mono", data: small, weight: 400, style: "normal" },
      ],
    },
  );
}
