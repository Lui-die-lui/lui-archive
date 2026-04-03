"use client";

import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

/** 브라우저 전용 Firebase Auth 인스턴스 */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}
