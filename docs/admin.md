# Admin 인증 및 관리 구조

## 상태

- **DB·스키마(1단계)**: [cms-prisma-design.md](./cms-prisma-design.md) — Prisma 모델·시드·`/admin` 모듈 단위 제안.
- **인증·API·UI**: 아직 미연결. 관리자 전용 라우트는 추후 Auth(예: GitHub OAuth + `ADMIN_EMAIL` 화이트리스트)로 보호.

## 추후 기록·구현 예정

- Vercel 환경 변수: `DATABASE_URL`, Firebase Storage 관련 키, 관리자 OAuth 클라이언트
- `middleware.ts` 또는 `app/admin/layout.tsx`에서 세션 검증
- 방명록: `SiteSettings.guestbookSubmissionsOpen` + 관리자 삭제·전체 삭제 API
- 배포 보호: Vercel Deployment Protection으로 `/admin` 이중 잠금(선택)

## 관련 문서

- [cms-prisma-design.md](./cms-prisma-design.md)
