import { NextResponse } from "next/server";
import { isAllowedAdminEmail } from "@/lib/admin-email";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SEC,
} from "@/lib/admin-session/constants";
import { safeAdminPathAfterLogin } from "@/lib/admin-session/safe-redirect";
import { signAdminSession } from "@/lib/admin-session/sign";
import {
  isFirebaseAdminSdkConfigured,
  resolveGoogleSignInEmail,
  verifyAdminFirebaseIdToken,
} from "@/lib/firebase/admin-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const adminEmailEnv = process.env.ADMIN_EMAIL?.trim();

  if (!secret || !adminEmailEnv) {
    return NextResponse.json(
      { error: "관리자 로그인이 구성되지 않았습니다." },
      { status: 503 },
    );
  }

  if (!isFirebaseAdminSdkConfigured()) {
    return NextResponse.json(
      { error: "Firebase Admin(서버) 환경 변수를 설정해 주세요." },
      { status: 503 },
    );
  }

  const webProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const adminProjectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  if (
    webProjectId &&
    adminProjectId &&
    webProjectId !== adminProjectId
  ) {
    return NextResponse.json(
      {
        error:
          "NEXT_PUBLIC_FIREBASE_PROJECT_ID와 FIREBASE_ADMIN_PROJECT_ID가 같아야 합니다. 동일 Firebase 프로젝트의 웹 앱·서비스 계정을 사용해 주세요.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const idToken = typeof b.idToken === "string" ? b.idToken.trim() : "";
  const fromRaw = typeof b.from === "string" ? b.from : undefined;

  if (!idToken) {
    return NextResponse.json(
      { error: "인증 토큰이 없습니다." },
      { status: 400 },
    );
  }

  let decoded: Awaited<ReturnType<typeof verifyAdminFirebaseIdToken>>;
  try {
    decoded = await verifyAdminFirebaseIdToken(idToken);
  } catch {
    return NextResponse.json(
      { error: "유효하지 않거나 만료된 인증 토큰입니다." },
      { status: 401 },
    );
  }

  if (decoded.firebase?.sign_in_provider !== "google.com") {
    return NextResponse.json(
      { error: "Google 계정으로만 로그인할 수 있습니다." },
      { status: 403 },
    );
  }

  const email = await resolveGoogleSignInEmail(decoded);
  if (!email) {
    return NextResponse.json(
      {
        error:
          "이 Google 계정에서 이메일을 읽을 수 없습니다. Google 계정에 이메일이 연결되어 있는지 확인하거나, 잠시 후 다시 시도해 주세요.",
      },
      { status: 403 },
    );
  }

  if (!isAllowedAdminEmail(email, adminEmailEnv)) {
    return NextResponse.json(
      { error: "관리자 계정만 접근할 수 있습니다." },
      { status: 403 },
    );
  }

  const token = signAdminSession(secret);
  const res = NextResponse.json({
    ok: true,
    redirectTo: safeAdminPathAfterLogin(fromRaw),
  });

  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });

  return res;
}
