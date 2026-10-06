/** Hairline rule. `strong` uses the border step instead of the hairline step. */
export function Rule({ strong = false, className = "" }: { strong?: boolean; className?: string }) {
  return <hr className={`border-0 border-t ${strong ? "border-line" : "border-hair"} ${className}`} />;
}
