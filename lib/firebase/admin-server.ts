/**
 * 서버 전용(API Route 등) — Firebase Admin으로 ID 토큰 검증.
 * 클라이언트 번들에 포함되지 않도록 이 파일은 클라이언트에서 import 하지 마세요.
 */
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

let adminApp: App | undefined;

export function isFirebaseAdminSdkConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim(),
  );
}

function getAdminApp(): App {
  if (adminApp) return adminApp;
  const existing = getApps()[0];
  if (existing) {
    adminApp = existing;
    return adminApp;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw?.trim()) {
    throw new Error("Firebase Admin 환경 변수가 설정되지 않았습니다.");
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  return adminApp;
}

export async function verifyAdminFirebaseIdToken(idToken: string) {
  const auth = getAuth(getAdminApp());
  return auth.verifyIdToken(idToken, true);
}

/**
 * ID 토큰에 email 클레임이 비어 있을 때(간헐적) Auth 사용자·providerData에서 보완.
 */
export async function resolveGoogleSignInEmail(
  decoded: DecodedIdToken,
): Promise<string | null> {
  const fromToken = decoded.email?.trim();
  if (fromToken) return fromToken;

  const auth = getAuth(getAdminApp());
  try {
    const user = await auth.getUser(decoded.uid);
    if (user.email?.trim()) return user.email.trim();
    const google = user.providerData.find((p) => p.providerId === "google.com");
    if (google?.email?.trim()) return google.email.trim();
  } catch {
    return null;
  }
  return null;
}
