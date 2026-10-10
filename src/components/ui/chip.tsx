/**
 * Tech chip: a pill on the soft edge, text face, with an optional qualifier
 * ("notebook"). Stage 7 shape (docs/ISSUES.md ISS-42).
 */
export function Chip({ name, qualifier }: { name: string; qualifier?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-hair px-2.5 py-0.5 text-mono-lg text-ink-2">
      {name}
      {qualifier ? <span className="text-ink-3">· {qualifier}</span> : null}
    </span>
  );
}
