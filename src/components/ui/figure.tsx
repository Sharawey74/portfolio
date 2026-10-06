import type { ReactNode } from "react";

/**
 * Figure with a mono caption ("FIG. 03 / Booking flow") and an optional
 * visually hidden long description for diagrams and charts.
 */
export function Figure({
  number,
  caption,
  description,
  className = "",
  children,
}: {
  number: number;
  caption: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure className={`flex flex-col gap-3 ${className}`}>
      {children}
      <figcaption className="mono-label text-ink-3">
        FIG. <span className="num">{String(number).padStart(2, "0")}</span> / {caption}
        {description ? <span className="sr-only">. {description}</span> : null}
      </figcaption>
    </figure>
  );
}
