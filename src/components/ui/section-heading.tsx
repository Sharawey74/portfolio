import { RevealText } from "@/components/motion/reveal-text.tsx";

/**
 * Numbered section index ("01 / Work") over an oversized display title.
 * The title's words rise into view (M3) and the block settles in scale as it
 * enters the viewport (CSS view() timeline, decorative, see .title-track).
 */
export function SectionHeading({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <header className="title-track col-span-full flex flex-col gap-4 md:col-span-10 md:col-start-2">
      <p className="mono-label text-ink-3">
        <span className="num">{index}</span> / {title}
      </p>
      <RevealText as="h2" id={id} text={title} className="font-display text-display-l" />
    </header>
  );
}
