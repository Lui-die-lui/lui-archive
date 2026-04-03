/**
 * 로그인 후 `from` 쿼리 — 오픈 리다이렉트 방지, /admin 하위만 허용.
 */
export function safeAdminPathAfterLogin(from: string | string[] | undefined): string {
  const raw = Array.isArray(from) ? from[0] : from;
  if (!raw || typeof raw !== "string") return "/admin";
  if (!raw.startsWith("/admin")) return "/admin";
  if (raw.startsWith("//")) return "/admin";
  if (raw.includes("..")) return "/admin";
  if (raw === "/admin/login") return "/admin";
  return raw;
}
