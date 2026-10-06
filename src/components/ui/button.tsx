import type { ComponentProps, ReactNode } from "react";

type Variant = "filled" | "outline";

const base =
  "inline-flex min-h-11 items-center gap-3 rounded-xs px-5 font-sans text-small font-medium " +
  "transition-[background-color,color,border-color,translate] duration-200 ease-out";

const variants: Record<Variant, string> = {
  filled: "bg-ink text-page hover:bg-ink-soft",
  outline: "border border-line-strong text-ink hover:border-ink hover:bg-hover",
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
      data-magnetic={magnetic ? "" : undefined}
      data-cursor={cursorLabel}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
