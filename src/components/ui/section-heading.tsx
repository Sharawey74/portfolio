/** Numbered section index ("01 / Work") over an oversized display title. */
export function SectionHeading({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <header className="col-span-full flex flex-col gap-4 md:col-span-10 md:col-start-2">
      <p className="mono-label text-ink-3">
        <span className="num">{index}</span> / {title}
      </p>
      <h2 id={id} className="font-display text-display-l">
        {title}
      </h2>
    </header>
  );
}
