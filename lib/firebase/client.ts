import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

function clientConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || undefined,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || undefined,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || undefined,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || undefined,
  };
}

/** 브라우저에서 Storage 업로드 가능 여부(빌드 시 주입된 env 기준) */
export function isFirebaseStorageConfigured(): boolean {
  const c = clientConfig();
  return Boolean(c.apiKey && c.storageBucket);
}

/** Google 로그인(Auth)에 필요한 최소 클라이언트 설정 */
export function isFirebaseAuthConfigured(): boolean {
  const c = clientConfig();
  return Boolean(c.apiKey && c.authDomain);
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  const c = clientConfig();
  if (!c.apiKey || !c.authDomain) return null;
  if (!getApps().length) {
    return initializeApp(c);
  }
  return getApp();
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp();
  return app ? getStorage(app) : null;
}
