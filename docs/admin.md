# Admin 인증 및 관리 구조

## 현재 구현 (1인 관리자 · Google + 이메일 화이트리스트)

- **숨은 진입**: 푸터의 **「Lui Archive」** 텍스트 → [`/admin/login`](http://localhost:3000/admin/login) (일반 버튼 노출 없음).
- **인증 화면**: `/admin/login` — **Firebase Auth Google**(팝업 또는 같은 창 리다이렉트). 회원가입·비밀번호 찾기 UI 없음.
- **권한**: Google 로그인 성공 직후 **서버**가 ID 토큰을 검증하고, 토큰의 이메일이 `.env`의 **`ADMIN_EMAIL`**(비공개)과 일치할 때만 HttpOnly 세션 쿠키를 발급합니다. 일치하지 않으면 API는 403을 반환하고, 클라이언트는 **Firebase `signOut`**으로 브라우저 세션을 끊습니다.
- **보호 구역**: `/admin`, `/admin/*` 단, **`/admin/login` 제외** — 미들웨어에서 쿠키(`lui_archive_admin`)의 HMAC 서명을 검증.
- **API**: `POST /api/admin/login`(ID 토큰 교환), `POST /api/admin/logout`, **`PATCH /api/admin/site-settings`** 등(인증 쿠키 필요).
- **프로젝트(홈 Works)**: 생성·수정·삭제·순서 API와 클라이언트 UI는 [admin-projects-ui.md](./admin-projects-ui.md)에 정리.
- **헤더**: 대시보드(`/admin`)에서도 포트폴리오와 동일한 `SiteHeader`를 표시합니다. 관리자 로그인 시 중앙 네비에 **`dashboard`** → `/admin` 링크가 보입니다.

### 로그인 성공 / 실패 흐름

1. 사용자가 **Google로 관리자 로그인** 클릭 → `signInWithPopup` 또는 **같은 창** `signInWithRedirect`로 Firebase에 로그인.
2. 클라이언트가 `user.getIdToken()`으로 **ID 토큰**을 받아 `POST /api/admin/login`에 전달.
3. **서버**: `firebase-admin`으로 토큰 검증 → `sign_in_provider === google.com`·이메일 존재 → `ADMIN_EMAIL`과 이메일 비교(대소문자·앞뒤 공백 무시).
4. **성공**: 기존과 동일하게 HMAC 세션 쿠키 설정 후 `redirectTo` 반환.
5. **실패(잘못된 토큰 등)**: 401/400 등 — 클라이언트에서 `signOut` 후 메시지 표시.
6. **실패(허용되지 않은 Google 계정)**: 403 + `"관리자 계정만 접근할 수 있습니다."` — 클라이언트에서 **즉시 `signOut(auth)`** 후 동일 메시지 표시. DB/관리 쿠키는 발급되지 않음.

### 대시보드 (`/admin`)

- **요약 카드**: 누적 방문(하루 1회·쿠키), 최근 7일 방문, 방명록 전체 글 수, **최근 24시간 새 방명록(게스트만)**.
- **차트(Recharts)**: 최근 14일 **일별 방문**, **일별 게스트 방명록** (한국 시간 `Asia/Seoul` 달력일 기준 집계).
- **방명록 수신 토글**: 도배·악성 글 시 `SiteSettings.guestbookSubmissionsOpen`을 끄면 **새 글 POST만 차단**(목록 조회는 유지). 공개 API `GET/POST /api/guestbook`이 동일 플래그를 사용합니다.

### 방문 기록

- **`POST /api/visit`**: 공개 페이지에서 `VisitBeacon`(루트 레이아웃)이 호출. HttpOnly 쿠키 `lui_portfolio_visit_day`(UTC `YYYY-MM-DD`)로 **같은 날 중복 기록 방지**.
- Prisma 모델 **`SiteVisit`** — `db push` 후 사용.

### 환경 변수

| 변수 | 용도 |
|------|------|
| `ADMIN_EMAIL` | 허용할 관리자 Google 이메일(서버 전용, `NEXT_PUBLIC_` 금지). |
| `ADMIN_SESSION_SECRET` | 세션 토큰 HMAC용 비밀(긴 무작위 문자열 권장). |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin 서비스 계정 — ID 토큰 검증. |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | 서비스 계정 `client_email`. |
| `FIREBASE_ADMIN_PRIVATE_KEY` | 서비스 계정 `private_key`(`\n` 이스케이프). |
| `NEXT_PUBLIC_FIREBASE_*` | 웹 앱 설정(Auth 팝업·Storage 등). |

루트 `.env.example` 참고. 배포 시 Vercel 등에 동일 키 등록.

**Firebase 콘솔·Storage 규칙·COOP 콘솔 경고·이메일 토큰 보완** 등 상세는 [firebase-admin.md](./firebase-admin.md) 참고.

### 추후 확장

- **CMS 모듈**: `app/admin/` 하위에 `skills`, `projects` 등 라우트 추가 — 미들웨어가 자동 보호.
- **이중 잠금**: Vercel Deployment Protection 등(선택).

## DB·스키마

- [cms-prisma-design.md](./cms-prisma-design.md) — Prisma 모델·시드·admin 모듈 단위 제안.

## 관련 파일

```
middleware.ts                          # /admin 보호 (Edge · HMAC)
lib/admin-session/constants.ts         # 쿠키 이름·만료
lib/admin-session/sign.ts              # 토큰 서명 (Node, 로그인 API)
lib/admin-session/verify.ts          # 토큰 검증 (Edge)
lib/admin-session/safe-redirect.ts   # 로그인 후 from 화이트리스트
lib/admin-email.ts                    # ADMIN_EMAIL 정규화·비교
lib/firebase/client.ts                # 웹 앱 초기화 · Storage
lib/firebase/auth.ts                  # 클라이언트 Auth
lib/firebase/sign-in-admin.ts         # Google 팝업·리다이렉트 + 세션 교환
lib/firebase/admin-session-exchange.ts
lib/firebase/admin-server.ts          # Admin SDK · ID 토큰 검증 (서버 전용)
lib/firebase/uploadProjectThumbnail.ts
app/api/admin/login/route.ts
app/api/admin/logout/route.ts
app/api/admin/site-settings/route.ts   # PATCH guestbookSubmissionsOpen
app/api/admin/projects/route.ts        # POST 프로젝트 생성
app/api/admin/projects/[publicId]/route.ts  # PATCH / DELETE
app/api/admin/projects/reorder/route.ts     # PATCH sortOrder 일괄
app/api/admin/certs/route.ts                # POST 자격증 생성
app/api/admin/certs/[id]/route.ts           # PATCH / DELETE
app/api/admin/certs/reorder/route.ts        # PATCH Certification 순서
app/api/visit/route.ts                 # POST 방문 1일 1회
app/admin/layout.tsx
app/admin/page.tsx                     # 대시보드·통계·토글
app/admin/login/page.tsx
components/admin/AdminLoginForm.tsx
components/admin/AdminLogoutButton.tsx
components/admin/AdminDashboardPanel.tsx
components/analytics/VisitBeacon.tsx
lib/admin-auth.ts
lib/dashboard-stats.ts
lib/visit-cookie.ts
components/layout/AppHeader.tsx
components/layout/Footer.tsx           # Lui Archive → /admin/login
```

## 관련 문서

- [firebase-admin.md](./firebase-admin.md) — Firebase Auth·Admin·Storage·COOP·트러블슈팅
- [cms-prisma-design.md](./cms-prisma-design.md)
- [admin-projects-ui.md](./admin-projects-ui.md) — 홈 Projects CMS UI·DnD·낙관적 갱신·API
- [admin-certs-ui.md](./admin-certs-ui.md) — 홈 Certs DB·DnD 순서
