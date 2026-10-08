import { profile } from "@/data/profile.ts";
import { OG_SIZE, renderOg } from "@/lib/og.tsx";

export const alt = `${profile.hero.headline.text.replace(/\.$/, "")}, ${profile.hero.label.text.toLowerCase()}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    kicker: profile.hero.label.text.toUpperCase(),
    title: profile.hero.headline.text,
    footer: profile.meta.ogLine,
  });
}
