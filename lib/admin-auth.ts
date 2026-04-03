import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-session/constants";
import { verifyAdminSession } from "@/lib/admin-session/verify";

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/** 관리자 API Route Handler에서 사용 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "관리자 세션이 구성되지 않았습니다." },
        { status: 503 },
      ),
    };
  }

  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminSession(token, secret))) {
    return {
      ok: false,
      response: NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 }),
    };
  }

  return { ok: true };
}

/** 네비 등 UI에서 관리자 로그인 여부만 판별할 때 */
export async function isAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSession(token, secret);
}
