const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-07" or "2026-07-14" → "Jul 2026" (fixed English, no locale drift between server and client). */
export function monthYear(iso: string): string {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** "2026-07-14" → "14 Jul 2026". */
export function dayMonthYear(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
