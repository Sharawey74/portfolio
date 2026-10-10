import type { ComponentProps, ReactNode } from "react";

type Variant = "filled" | "outline" | "quiet";

/**
 * Pill buttons (ISS-22). Stage 7 (ISS-42): hover lifts the button 1 px and
 * shifts it within the neutral ramp (filled to --text-soft, outline to the
 * hover surface with the strong line); the accent stays for marks. A trailing
 * arrow glyph (`data-arrow`) moves 4 px in its direction. "quiet" is the
 * project card's Source button (hairline edge, secondary text), which the owner
 * chose for the hero CTAs and Case study too (2026-10-10, ISS-45).
 */
const base =
  "btn inline-flex min-h-11 items-center rounded-pill font-sans text-small font-medium " +
  "transition-[background-color,color,border-color,translate] duration-200 ease-out hover:-translate-y-px";

const variants: Record<Variant, string> = {
  filled: "gap-3 px-6 bg-ink text-page hover:bg-ink-soft",
  outline: "gap-3 px-6 border border-line text-ink hover:border-line-strong hover:bg-hover",
  quiet: "gap-2 px-5 border border-hair text-ink-2 hover:border-line-strong hover:bg-hover hover:text-ink",
};

/** The quiet button's classes, for links that are not ButtonLinks (Next `Link`). */
export const quietButton = `${base} gap-2 px-5 border border-hair text-ink-2 hover:border-line-strong hover:bg-hover hover:text-ink`;

// Disabled buttons do not lift or show the accent edge: they cannot be used.
const disabledStyle = "gap-2 px-5 border border-hair text-ink-3 cursor-not-allowed hover:translate-y-0";

type Common = {
  variant?: Variant;
  /** Leans toward the pointer (fine pointer, motion allowed). */
  magnetic?: boolean;
  /** Short cursor label, e.g. "Open". Decorative; the button keeps its name. */
  cursorLabel?: string;
  children: ReactNode;
};

export function Button({
  variant = "filled",
  magnetic,
  cursorLabel,
  disabled,
  className = "",
  children,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-magnetic={magnetic && !disabled ? "" : undefined}
      data-cursor={cursorLabel}
      className={`${base} ${disabled ? disabledStyle : variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "filled",
  magnetic,
  cursorLabel,
  className = "",
  children,
  ...rest
}: Common & ComponentProps<"a">) {
  return (
    <a
      data-press=""
      data-magnetic={magnetic ? "" : undefined}
      data-cursor={cursorLabel}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
