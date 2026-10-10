import type { ComponentProps, ReactNode } from "react";

type Variant = "filled" | "outline";

/**
 * Pill buttons (ISS-22). Stage 7 (ISS-42): hover lifts the button 1 px and
 * shifts it within the neutral ramp (filled to --text-soft, outline to the
 * hover surface with the strong line); the accent stays for marks. A trailing
 * arrow glyph (`data-arrow`) moves 4 px in its direction.
 */
const base =
  "btn inline-flex min-h-11 items-center gap-3 rounded-pill px-6 font-sans text-small font-medium " +
  "transition-[background-color,color,border-color,translate] duration-200 ease-out hover:-translate-y-px";

const variants: Record<Variant, string> = {
  filled: "bg-ink text-page hover:bg-ink-soft",
  outline: "border border-line text-ink hover:border-line-strong hover:bg-hover",
};

const disabledStyle = "border border-hair text-ink-3 cursor-not-allowed";

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
