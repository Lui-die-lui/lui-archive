/**
 * OG·metadataBase 등에 쓰는 사이트 원점 URL (슬래시 없음).
 * 배포: NEXT_PUBLIC_SITE_URL 권장. 비우면 Vercel의 VERCEL_URL, 로컬은 localhost.
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
