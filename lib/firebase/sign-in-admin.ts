"use client";

import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { exchangeIdTokenForAdminSession } from "@/lib/firebase/admin-session-exchange";
import { getFirebaseAuth } from "@/lib/firebase/auth";

const FROM_STORAGE_KEY = "lui_archive_admin_login_from";

function mapFirebaseAuthError(e: unknown): Error {
  if (e && typeof e === "object" && "code" in e) {
    const code = String((e as { code?: string }).code);
    const hints: Record<string, string> = {
      "auth/popup-closed-by-user": "로그인 창이 닫혔습니다.",
      "auth/cancelled-popup-request": "로그인이 취소되었습니다.",
      "auth/popup-blocked":
        "팝업이 차단되었습니다. 아래 「같은 창에서 로그인」을 사용해 보세요.",
      "auth/unauthorized-domain":
        "이 주소가 Firebase에 등록되어 있지 않습니다. Firebase 콘솔 → Authentication → 설정 → 승인된 도메인에 localhost, 127.0.0.1, 그리고 접속 중인 주소(예: 192.168.x.x)를 추가하세요.",
      "auth/operation-not-allowed":
        "Google 로그인이 꺼져 있습니다. Firebase 콘솔 → Authentication → 로그인 방법에서 Google을 사용 설정하세요.",
      "auth/network-request-failed":
        "네트워크 오류로 Google에 연결하지 못했습니다.",
    };
    if (hints[code]) return new Error(hints[code]);
  }
  if (e instanceof Error && e.message) return e;
  return new Error("Google 로그인에 실패했습니다.");
}

/**
 * 관리자 전용: Google 팝업 로그인 후 ID 토큰을 서버에 넘겨 세션 쿠키를 발급받습니다.
 */
export async function signInAdmin(fromPath?: string): Promise<{
  redirectTo: string;
}> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase 클라이언트 설정(NEXT_PUBLIC_FIREBASE_*)을 확인해 주세요.");
  }

  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({ prompt: "select_account" });

  let idToken: string;
  try {
    const result = await signInWithPopup(auth, provider);
    idToken = await result.user.getIdToken();
  } catch (e) {
    throw mapFirebaseAuthError(e);
  }

  return exchangeIdTokenForAdminSession(idToken, fromPath);
}

/**
 * 팝업 대신 전체 창으로 Google 로그인(팝업 차단·하얀 창만 뜨는 환경용).
 * 완료 후 돌아오면 `completeAdminRedirectLoginIfPresent`가 세션을 마저 받습니다.
 */
export async function signInAdminRedirect(fromPath?: string): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase 클라이언트 설정(NEXT_PUBLIC_FIREBASE_*)을 확인해 주세요.");
  }

  try {
    if (fromPath) sessionStorage.setItem(FROM_STORAGE_KEY, fromPath);
    else sessionStorage.removeItem(FROM_STORAGE_KEY);
  } catch {
    /* private mode 등 */
  }

  const provider = new GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    await signInWithRedirect(auth, provider);
  } catch (e) {
    throw mapFirebaseAuthError(e);
  }
}

/**
 * `signInAdminRedirect` 후 복귀한 페이지에서 한 번 호출.
 * 리다이렉트 결과가 없으면 `null`.
 */
export async function completeAdminRedirectLoginIfPresent(): Promise<{
  redirectTo: string;
} | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  let result;
  try {
    result = await getRedirectResult(auth);
  } catch (e) {
    throw mapFirebaseAuthError(e);
  }

  if (!result?.user) return null;

  const idToken = await result.user.getIdToken();
  let fromPath: string | undefined;
  try {
    fromPath = sessionStorage.getItem(FROM_STORAGE_KEY) ?? undefined;
    sessionStorage.removeItem(FROM_STORAGE_KEY);
  } catch {
    /* ignore */
  }

  return exchangeIdTokenForAdminSession(idToken, fromPath);
}
