import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { getFirebaseStorage } from "@/lib/firebase/client";

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Firebase Storage `portfolio/projects/{publicId}/…` 에 이미지 업로드 후 다운로드 URL 반환.
 * 클라이언트 전용(Storage 규칙에 맞게 인증·권한 설정 필요).
 */
export async function uploadProjectThumbnail(
  projectPublicId: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("파일 크기는 5MB 이하여야 합니다.");
  }

  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error(
      "Firebase가 설정되지 않았습니다. API Key·Storage Bucket 등 환경 변수를 확인해 주세요.",
    );
  }

  const auth = getFirebaseAuth();
  if (!auth?.currentUser) {
    throw new Error(
      "Storage 규칙상 로그인된 사용자만 업로드할 수 있습니다. /admin/login 에서 Google 로그인을 다시 한 뒤(같은 브라우저 탭에서) 시도해 주세요.",
    );
  }

  const safeName = file.name.replace(/[^\w.-]+/g, "_").slice(0, 100);
  const path = `portfolio/projects/${projectPublicId}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type || "application/octet-stream",
  });
  return getDownloadURL(storageRef);
}
