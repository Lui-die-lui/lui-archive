# Firebase · 관리자 연동 가이드

관리자 Google 로그인(Firebase Auth), ID 토큰 검증(Firebase Admin), 프로젝트 썸네일 업로드(Storage)를 쓸 때의 설정·트러블슈팅을 정리합니다.  
세션 쿠키·미들웨어 개요는 [admin.md](./admin.md)를 참고하세요.

---

## 1. 역할 구분

| 구분 | 담당 |
|------|------|
| **브라우저** | Firebase Web SDK로 Google 로그인 → ID 토큰 발급 → `POST /api/admin/login`으로 교환. Storage 업로드 시에도 **Firebase `currentUser`** 가 있어야 함. |
| **서버** | `firebase-admin`으로 ID 토큰 검증, `ADMIN_EMAIL`과만 일치 시 HMAC HttpOnly 쿠키 발급. `ADMIN_EMAIL`은 `NEXT_PUBLIC_` 로 노출하지 않음. |
| **관리자 쿠키** | `/admin`·관리 API 접근. Firebase 로그인과 별개이나, Storage 규칙은 **Firebase Auth**만 본다. |

---

## 2. 환경 변수

자세한 키 목록은 루트 **`.env.example`** 과 동일합니다.

- **`ADMIN_EMAIL`**: 로그인에 쓰는 Google 계정 이메일과 같게(대소문자·앞뒤 공백 무시하고 비교).
- **`ADMIN_SESSION_SECRET`**: 세션 HMAC용.
- **`FIREBASE_ADMIN_PROJECT_ID`**, **`FIREBASE_ADMIN_CLIENT_EMAIL`**, **`FIREBASE_ADMIN_PRIVATE_KEY`**: 서비스 계정 JSON 필드.  
  - `PRIVATE_KEY`는 `.env` 한 줄에 넣을 때 줄바꿈을 `\n` 이스케이프로 두는 경우가 많음 → 코드에서 `replace(/\\n/g, "\n")` 로 복원.
- **`NEXT_PUBLIC_FIREBASE_*`**: 웹 앱 구성. **`NEXT_PUBLIC_FIREBASE_PROJECT_ID`** 는 **`FIREBASE_ADMIN_PROJECT_ID`** 와 **같은 Firebase 프로젝트**여야 로그인 API가 정상 동작합니다.

별도 **`GOOGLE_CLIENT_ID` / OAuth 클라이언트 시크릿** 은 Firebase Web SDK만 쓰면 필수 아님(콘솔에서 Google 로그인만 켜면 됨).

---

## 3. Firebase 콘솔 체크리스트

1. **Authentication → Sign-in method → Google** 사용 설정.
2. **Authentication → 설정 → 승인된 도메인**  
   - `localhost`, 배포 도메인, 로컬에서 **IP로 접속**하면 해당 호스트(예: `192.168.x.x`)도 추가.
3. **프로젝트 설정**에서 웹 앱의 구성 값이 `.env`의 `NEXT_PUBLIC_FIREBASE_*` 와 일치하는지 확인.
4. **Storage**  
   - 앱이 가리키는 **`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`** 과 콘솔에서 규칙을 편집 중인 **버킷**이 같은지 확인.

---

## 4. Storage 규칙·업로드 경로

앱에서 업로드하는 객체 경로는 다음 형태입니다.

```text
portfolio/projects/{projectPublicId}/{timestamp}_{파일명}
```

예시 규칙(프로젝트에 맞게 조정):

```text
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /portfolio/projects/{projectId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

- **`request.auth != null`** 은 **Firebase Authentication 로그인**이 있을 때만 참입니다. 관리자 **HttpOnly 쿠키만** 있고 `signOut` 등으로 Firebase 유저가 없으면 업로드가 거절됩니다.
- 규칙 저장 후 **게시**했는지 확인합니다.

---

## 5. 로그인 방식(팝업 / 같은 창)

| 방식 | 코드 | 비고 |
|------|------|------|
| 팝업 | `signInWithPopup` | 일부 브라우저·COOP 설정에서 콘솔 경고가 날 수 있음(아래 §6). |
| 같은 창 | `signInWithRedirect` + 복귀 후 `getRedirectResult` | 팝업 차단·하얀 창만 잠깐 뜨는 환경에서 유리. |

---

## 6. Cross-Origin-Opener-Policy(COOP) 콘솔 경고

증상: `Cross-Origin-Opener-Policy policy would block the window.closed call.`  
(`sign-in-admin.ts`, `gapi` 스택 등)

- **원인**: 문서의 COOP가 팝업과 **같은 창 참조·`window.closed`** 확인을 막을 때, Google/Firebase 팝업 흐름이 내부적으로 해당 API를 사용하면서 경고가 난다. 로그인은 될 수 있어도 콘솔만 시끄러울 수 있다.
- **대응**: 루트 `next.config.ts`에서 응답 헤더 **`Cross-Origin-Opener-Policy: same-origin-allow-popups`** 를 설정해 OAuth 팝업과 호환되게 한다(프로젝트에 반영됨).
- **대안**: 팝업 대신 **「같은 창에서 로그인」** 만 사용하면 해당 경로 자체가 없어진다.

배포 플랫폼에서 헤더를 덮어쓰면 동일 정책을 맞춰야 할 수 있다.

---

## 7. 서버 로그인 API에서 이메일 처리

- ID 토큰에 **`email` 클레임이 비는 경우**가 있어, 토큰만으로 부족하면 Admin SDK **`getUser(uid)`** 로 사용자 레코드·`providerData`(Google)에서 이메일을 보완한다.
- **`email_verified`** 는 Google 전용 흐름에서는 토큰 값이 불안정할 수 있어, 제공자가 `google.com`일 때는 **이메일 문자열 존재 + `ADMIN_EMAIL` 일치** 중심으로 통과시킨다.

---

## 8. Next.js 16 · `/admin/login`

앱 라우터에서 **`searchParams`는 Promise** 로 넘어올 수 있다. `/admin/login` 페이지에서는 `await searchParams` 후 `from` 등을 읽는다. 동기 접근만 하면 RSC 오류·400으로 이어질 수 있다.

---

## 9. 대시보드 차트(Recharts)

- **일별 추이**(방문·방명록)는 **`Asia/Seoul`(KST) 달력일**로 버킷한다. `lib/dashboard-stats.ts` 참고. 요약 카드의 **최근 7일 방문** 범위 시작 시각도 동일 기준(해당일 00:00 KST)이다.
- `ResponsiveContainer`가 그리드에서 첫 측정 시 너비·높이를 음수로 잡으면 브라우저에 경고가 난다. 차트 래퍼에 **`min-w-0`** , **`ResponsiveContainer`에 픽셀 높이**를 쓴다.

---

## 10. 관련 소스 파일

| 경로 | 설명 |
|------|------|
| `lib/firebase/client.ts` | Web 앱 초기화, Storage·Auth 설정 여부 헬퍼 |
| `lib/firebase/auth.ts` | 클라이언트 `getAuth` |
| `lib/firebase/sign-in-admin.ts` | 팝업/리다이렉트 로그인, Firebase 에러 코드별 메시지 |
| `lib/firebase/admin-session-exchange.ts` | ID 토큰 → `POST /api/admin/login` |
| `lib/firebase/admin-server.ts` | Admin SDK 초기화, 토큰 검증, 이메일 보완 |
| `lib/firebase/uploadProjectThumbnail.ts` | Storage 업로드, `currentUser` 없을 때 안내 |
| `app/api/admin/login/route.ts` | 토큰 검증·`ADMIN_EMAIL`·세션 쿠키 |
| `next.config.ts` | 이미지 도메인, **COOP(`same-origin-allow-popups`)** |
| `components/admin/AdminLoginForm.tsx` | 팝업 + 같은 창 로그인 UI |
| `middleware.ts` | `/admin/login`, `/admin/login/` 예외 처리 |
| `lib/dashboard-stats.ts` | 대시보드 집계·추이(서울 일자) |

---

## 관련 문서

- [admin.md](./admin.md) — 관리자 진입·세션·대시보드 기능 개요
- 루트 `.env.example` — 변수 템플릿
