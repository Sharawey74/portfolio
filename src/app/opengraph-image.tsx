import { personal } from "@/data/personal.ts";
import { profile } from "@/data/profile.ts";
import { OG_SIZE, renderOg } from "@/lib/og.tsx";

export const alt = profile.hero.headline.text;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    kicker: `${(personal.name.value ?? personal.github.handle).toUpperCase()} / ${profile.meta.title.split(" / ")[1]?.toUpperCase() ?? ""}`,
    title: profile.hero.headline.text,
    footer: profile.meta.ogLine,
  });
}
