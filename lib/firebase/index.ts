"use client";

export {
  getFirebaseApp,
  getFirebaseStorage,
  isFirebaseAuthConfigured,
  isFirebaseStorageConfigured,
} from "@/lib/firebase/client";
export { getFirebaseAuth } from "@/lib/firebase/auth";
export {
  completeAdminRedirectLoginIfPresent,
  signInAdmin,
  signInAdminRedirect,
} from "@/lib/firebase/sign-in-admin";
