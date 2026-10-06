/** Tech chip: mono label on a hairline, with an optional qualifier ("notebook"). */
export function Chip({ name, qualifier }: { name: string; qualifier?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xs border border-hair px-2 py-1 font-mono text-mono text-ink-2">
      {name}
      {qualifier ? <span className="text-ink-3">· {qualifier}</span> : null}
    </span>
  );
}
