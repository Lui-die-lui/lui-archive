/** 화면·DB `issuedAtLabel`과 동일 톤 (예: Mar 2026) */
export const ISSUED_MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatIssuedAtLabel(monthIndex0: number, year: number): string {
  const m = ISSUED_MONTH_SHORT[monthIndex0] ?? "Jan";
  return `${m} ${year}`;
}

/** "Mar 2026" → { monthIndex0: 2, year: 2026 } / 실패 시 현재 월·년 */
export function parseIssuedAtLabel(label: string): {
  monthIndex0: number;
  year: number;
} {
  const t = label.trim();
  const now = new Date();
  const fallback = {
    monthIndex0: now.getMonth(),
    year: now.getFullYear(),
  };
  const parts = t.split(/\s+/);
  if (parts.length < 2) return fallback;
  const mon = parts[0]!;
  const y = parseInt(parts[parts.length - 1]!, 10);
  const idx = ISSUED_MONTH_SHORT.indexOf(mon as (typeof ISSUED_MONTH_SHORT)[number]);
  if (idx < 0 || Number.isNaN(y) || y < 1970 || y > 2100) return fallback;
  return { monthIndex0: idx, year: y };
}
