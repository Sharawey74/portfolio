import type { ComponentProps } from "react";
import { profile } from "@/data/profile.ts";

/**
 * Inline link with a hairline underline. External links get the ↗ glyph
 * (mono, decorative) plus a visually hidden note for screen readers.
 */
export function TextLink({ href = "", className = "", children, ...rest }: ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      rel={external ? "noreferrer" : undefined}
      className={
        "underline decoration-line-strong decoration-1 underline-offset-4 " +
        "transition-[text-decoration-color] duration-200 ease-out hover:decoration-ink " +
        className
      }
      {...rest}
    >
      {children}
      {external ? (
        <>
          <span aria-hidden="true" className="ml-1 font-mono text-mono">
            ↗
          </span>
          <span className="sr-only"> ({profile.ui.externalLink})</span>
        </>
      ) : null}
    </a>
  );
}
