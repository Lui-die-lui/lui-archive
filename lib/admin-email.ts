/** 서버 전용 — ADMIN_EMAIL 과 Firebase 토큰의 email 비교 */

export function normalizeAdminEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isAllowedAdminEmail(
  userEmail: string | undefined,
  adminEmailEnv: string | undefined,
): boolean {
  if (!userEmail || !adminEmailEnv) return false;
  return normalizeAdminEmail(userEmail) === normalizeAdminEmail(adminEmailEnv);
}
