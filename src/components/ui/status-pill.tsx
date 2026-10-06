import { profile } from "@/data/profile.ts";

/**
 * PR status shown by shape, never by color alone:
 *   merged = filled pill + ✓
 *   open   = outline pill + ○ + the break dot (an allowed break use)
 * Text is always present.
 */
export function StatusPill({ status }: { status: "merged" | "open" }) {
  if (status === "merged") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xs bg-ink px-2 py-0.5 font-mono text-mono text-page">
        <span aria-hidden="true">✓</span>
        {profile.ui.statusMerged}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xs border border-line-strong px-2 py-0.5 font-mono text-mono text-ink">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-break" />
      <span aria-hidden="true">○</span>
      {profile.ui.statusOpen}
    </span>
  );
}
