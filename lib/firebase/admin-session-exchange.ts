"use client";

import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";

const WRONG_ACCOUNT_MSG = "관리자 계정만 접근할 수 있습니다.";

/** Google 로그인 직후 받은 Firebase ID 토큰으로 관리자 세션 쿠키 발급 */
export async function exchangeIdTokenForAdminSession(
  idToken: string,
  fromPath?: string,
): Promise<{ redirectTo: string }> {
  const auth = getFirebaseAuth();

  let res: Response;
  try {
    res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        from: fromPath || undefined,
      }),
    });
  } catch {
    if (auth) await signOut(auth).catch(() => {});
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    redirectTo?: string;
  };

  if (!res.ok) {
    if (auth) await signOut(auth);
    throw new Error(
      data.error ??
        (res.status === 403 ? WRONG_ACCOUNT_MSG : "로그인에 실패했습니다."),
    );
  }

  return {
    redirectTo:
      typeof data.redirectTo === "string" ? data.redirectTo : "/admin",
  };
}
