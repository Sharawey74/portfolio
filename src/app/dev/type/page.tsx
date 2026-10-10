import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button.tsx";
import { Chip } from "@/components/ui/chip.tsx";
import { Figure } from "@/components/ui/figure.tsx";
import { MonoLabel } from "@/components/ui/mono-label.tsx";
import { Rule } from "@/components/ui/rule.tsx";
import { SectionHeading } from "@/components/ui/section-heading.tsx";
import { StatusPill } from "@/components/ui/status-pill.tsx";
import { TextLink } from "@/components/ui/text-link.tsx";
import { BrandIcon } from "@/components/ui/brand-icon.tsx";
import { KernelDemo } from "./kernel-demo.tsx";
import { ScrollSpyNav } from "@/components/layout/scroll-spy-nav.tsx";
import { RevealText } from "@/components/motion/reveal-text.tsx";

const SPECIMEN_INDEX = [
  { id: "scale", index: "01", title: "Type scale" },
  { id: "ramp", index: "02", title: "Ramp" },
  { id: "break", index: "03", title: "Break color" },
  { id: "components", index: "04", title: "Components" },
  { id: "kernel", index: "05", title: "Motion kernel" },
];

/**
 * Developer specimen: type scale, ramp and edge lines, break-color rules,
 * base components (Stage 7: pills, section cards, brand-icon links, arrows) and
 * the motion kernel. Not public: noindex, and 404 on the Vercel production
 * deployment. Copy here describes the design system, not the owner.
 */
export const metadata: Metadata = {
  title: "Type specimen",
  robots: { index: false, follow: false },
};

const SCALE = [
  ["display-xl", "font-display text-display-xl font-light", "Correct under load"],
  ["display-l", "font-display text-display-l", "Booking lifecycle"],
  ["section", "font-heading text-section text-gradient", "Every figure has a source."],
  ["h2", "font-heading text-h2", "Ten states, one guard"],
  ["h3", "font-heading text-h3", "Optimistic locking returns 409"],
  ["body", "font-sans text-body", "A Redis Lua script checks availability and decrements in one atomic step."],
  ["small", "font-sans text-small text-ink-2", "Local, Docker Compose. Read path only."],
  ["mono label", "mono-label text-ink-3", "Source · PERFORMANCE.md:400"],
] as const;

const RAMP = [
  ["g0", "page"],
  ["g1", "raised"],
  ["g2", "card"],
  ["g3", "hover"],
  ["g4", "hairline"],
  ["g5", "border"],
  ["g6", "strong border"],
  ["g7", "decoration only"],
  ["g8", "text-3"],
  ["g9", "text-2"],
  ["g10", "text-soft"],
  ["g11", "text"],
] as const;

const BREAK_ALLOWED = [
  "Live / open status dot",
  "Active nav marker",
  "Focus ring",
  "The pause switch track when on",
  "The single active packet or node in a motion graphic",
  "One highlighted value per chart",
  "The H1 and wordmark periods, section index numbers",
  "Brand icons on hover",
  "The hero glow and pill arc; the glow behind the closing line",
];
const BREAK_FORBIDDEN = [
  "Body or heading text beyond the uses above",
  "Fills larger than a chip",
  "Glows anywhere else; drop shadows; purple or blue gradients",
  "Card borders",
];

export default function TypeSpecimen() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <div className="grid-12 gap-y-16 py-16">
      <div className="sticky top-(--header-h) z-10 col-span-full border-b border-hair bg-page md:col-span-10 md:col-start-2">
        <ScrollSpyNav items={SPECIMEN_INDEX} label="Specimen index" />
      </div>
      <SectionHeading id="scale" index="01" title="Type scale" />
      <div className="col-span-full flex flex-col md:col-span-10 md:col-start-2">
        {SCALE.map(([token, cls, sample]) => (
          <div key={token} className="grid grid-cols-1 gap-2 border-t border-hair py-6 md:grid-cols-[10rem_1fr]">
            <MonoLabel>{token}</MonoLabel>
            <p className={cls}>{sample}</p>
          </div>
        ))}
        <div className="grid grid-cols-1 gap-2 border-t border-hair py-6 md:grid-cols-[10rem_1fr]">
          <MonoLabel>italic emphasis</MonoLabel>
          <p className="font-display text-h2">
            Backend systems that stay <em>correct</em> under load<span className="text-break">.</span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 border-t border-hair py-6 md:grid-cols-[10rem_1fr]">
          <MonoLabel>tabular figures</MonoLabel>
          <p className="num font-display text-display-l">
            32,577 · 660 · 800 · 9.0
          </p>
        </div>
      </div>

      <SectionHeading id="ramp" index="02" title="Ramp" />
      <ul className="col-span-full grid grid-cols-2 gap-px bg-hair md:col-span-10 md:col-start-2 md:grid-cols-6">
        {[...RAMP, ["edge", "line: borders, card top edge"] as const, ["edge-soft", "line-hair: dividers"] as const].map(([token, role]) => (
          <li key={token} className="flex flex-col gap-8 bg-page p-3">
            <span className="block h-16 border border-hair" style={{ background: `var(--${token})` }} />
            <span className="flex flex-col gap-1">
              <span className="font-mono text-mono text-ink">--{token}</span>
              <span className="font-mono text-mono text-ink-3">{role}</span>
            </span>
          </li>
        ))}
      </ul>

      <SectionHeading id="break" index="03" title="Break color" />
      <div className="col-span-full grid grid-cols-1 gap-10 md:col-span-10 md:col-start-2 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <MonoLabel>Allowed</MonoLabel>
          <ul className="flex flex-col gap-1 text-ink-2">
            {BREAK_ALLOWED.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <MonoLabel>Forbidden</MonoLabel>
          <ul className="flex flex-col gap-1 text-ink-2">
            {BREAK_FORBIDDEN.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </div>
        <p className="text-small text-ink-3 md:col-span-2">
          One bright token, with --c1 and --c2 behind it for the palette option and ::selection. Budget: at most 2%
          of viewport pixels. Tab through the controls below to see the focus ring.
        </p>
      </div>

      <SectionHeading id="components" index="04" title="Components" />
      <div className="col-span-full flex flex-col gap-10 md:col-span-10 md:col-start-2">
        <div className="flex flex-wrap items-center gap-3">
          <Button magnetic cursorLabel="Open">
            Filled <span aria-hidden="true">→</span>
          </Button>
          <ButtonLink href="#components" variant="outline" magnetic>
            Outline link
          </ButtonLink>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </div>
        <p className="text-ink-2">
          Inline <TextLink href="#scale">internal link</TextLink> and{" "}
          <TextLink href="https://github.com/Sharawey74">external link</TextLink>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip name="Spring Boot 3.5" />
          <Chip name="PyTorch" qualifier="notebook" />
          <StatusPill status="merged" />
          <StatusPill status="open" />
        </div>
        <div role="group" aria-label="Pill group" className="pill-group self-start">
          <button type="button" aria-pressed="true" className="pill-option">
            Selected
          </button>
          <button type="button" aria-pressed="false" className="pill-option">
            Option
          </button>
          <button type="button" aria-pressed="false" className="pill-option">
            Option
          </button>
        </div>
        <div className="surface-card lift flex flex-col gap-3 p-6">
          <MonoLabel>surface-card · lift</MonoLabel>
          <p className="font-heading text-h3">Section card</p>
          <p className="text-ink-2">24 px radius, the stronger edge on top, an opaque fill one step above the page.</p>
          <p className="flex flex-wrap gap-x-6 text-small">
            <a href="#components" className="nudge inline-flex items-center gap-1.5 text-ink">
              Next <span aria-hidden="true" data-arrow="right">→</span>
            </a>
            <a href="https://github.com/Sharawey74" rel="noreferrer" className="icon-link inline-flex items-center gap-2 text-ink">
              <BrandIcon kind="github" />
              GitHub
            </a>
          </p>
        </div>
        <Rule />
        <Figure number={3} caption="Booking flow" description="Placeholder figure for the specimen.">
          <div className="grid h-40 place-items-center border border-hair bg-raised">
            <MonoLabel>figure body</MonoLabel>
          </div>
        </Figure>
        <Rule strong />
      </div>

      <div className="col-span-full flex flex-col gap-3 md:col-span-6 md:col-start-2">
        <MonoLabel>reveal · lines</MonoLabel>
        <RevealText
          as="p"
          mode="lines"
          className="font-display text-h2"
          text="A Redis Lua script checks availability and decrements in one atomic step, so a 50-seat tier sells exactly 50."
        />
      </div>

      <SectionHeading id="kernel" index="05" title="Motion kernel" />
      <div className="col-span-full md:col-span-10 md:col-start-2">
        <KernelDemo />
      </div>
    </div>
  );
}
