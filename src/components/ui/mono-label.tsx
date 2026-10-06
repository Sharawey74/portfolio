import type { ReactNode } from "react";

/** Uppercase mono label for metadata, e.g. dates and sources. */
export function MonoLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`mono-label text-ink-3 ${className}`}>{children}</span>;
}
