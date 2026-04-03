# CMS / Prisma DB 설계 (1단계)

포트폴리오 **관리자 1인** 전제로, 기술 스택(내용만)·프로젝트·수료/자격·방명록·사이트 설정을 DB에서 다루기 위한 **Prisma 스키마 초안**과 운영 단위를 정리합니다.  
이미지는 **Firebase Storage에 업로드 후 HTTPS URL만 DB에 저장**합니다.

---

## 1. Prisma schema 위치

- `prisma/schema.prisma` — PostgreSQL(Neon 등) + `prisma-client-js`
- 시드: `prisma/seed.ts` — 기존 `data/*.ts` mock과 동등한 초기 데이터
- 클라이언트 싱글톤(Next 서버용): `lib/prisma.ts`

---

## 2. 모델별 역할

### `SkillCategoryContent`

- **고정**: 카드 종류는 4개뿐이며, 식별자는 enum `SkillCategorySlug` (`FRONTEND`, `BACKEND`, `DATA_STATE`, `BUILD_DEPLOY`).
- **DB에서 수정**: `techStack`(한 줄 나열), `description`.
- **앱 코드에서 고정**: 카드 제목·이모지·섹션 레이아웃은 `slug`에 매핑하는 상수 테이블로 유지 (요구사항: 타이틀 변경 불가).

### `Project` + `ProjectTechLine` + `ProjectTagOnProject`

- **CRUD 대상**: 프로젝트 전체.
- `publicId`: 기존 mock의 `id`(예: `omijoy`)와 같이 **안정적인 공개 키** (URL·캐시용).
- `thumbnailUrl`: Firebase 업로드 결과 URL. **null**이면 현재 Odyssey Plan처럼 플레이스홀더.
- `readmeUrl`: 필수.
- `deployUrl`: 선택. **null이면 LIVE 버튼 미노출** (프론트는 `deployUrl` 존재 여부만 보면 됨).
- 기술 목록: 정렬 가능한 **`ProjectTechLine`** 다대일 (라벨 문자열 + `sortOrder`).
- 태그 `team` / `personal` / `inprogress`: 고정 enum `ProjectKindTag`를 **`ProjectTagOnProject`**로 다대다에 가깝게 표현 (실제로는 `(projectId, tag)` 복합 PK로 중복 방지).

### `Certification`

- **CRUD 대상**: 수료·자격 항목.
- `issuedAtLabel`: 화면에 그대로 쓰는 문자열 (예: `Mar 2026`) — 국제화/파싱 없이 CMS 입력 단순화.
- `url`: null이면 카드 비클릭.
- `hasPublicLink`: **명시적** 플래그. `false`이면 UI에서 「링크 없음」(SQLD 패턴).  
  - 운영 규칙 예: `url`이 있으면 `hasPublicLink`는 true, 없으면 false (관리자 UI에서 검증).

### `GuestbookEntry`

- 방문자 작성(공개 API) + 관리자만 삭제.
- `authorType` `ADMIN` | `GUEST`, `bubbleColor`는 게스트만 사용(`ADMIN`은 null).
- 메시지 길이·닉네임 등은 **API/서버 액션에서 검증** (스키마는 문자열).

### `SiteSettings`

- **싱글톤**: `id === 1` 행만 사용.
- `guestbookSubmissionsOpen`: **false**면 방명록 POST 거부 + 프론트에서 입력 UI 비활성화.
- 추후 같은 테이블에 `maintenanceMessage` 등 확장 가능.

---

## 3. 고정 데이터 vs 수정 데이터 (경계)

| 영역 | 고정(코드) | DB |
|------|------------|-----|
| Skills 섹션 | 카드 수·제목·이모지·섹션 순서 | 각 슬롯별 `techStack`, `description` |
| Projects 섹션 | 카드 UI 규칙·LIVE 노출 규칙 | 전 레코드 + 태그·기술 줄 |
| Certs 섹션 | 카드 UI·「링크 없음」 규칙 | 전 레코드 |
| Guestbook | 말풍선 팔레트(색 키)는 코드 enum과 동기 | 글 본문 + 설정 플래그 |
| Admin 인증 | (다음 단계) OAuth·세션 | 이 스키마에는 **사용자 테이블 없음** |

---

## 4. 추후 `/admin` 관리 단위 제안

모듈을 나누면 화면·API가 작게 유지됩니다.

1. **`/admin/skills`** — `SkillCategoryContent` 4행 편집 폼 (슬롯 선택 또는 탭).
2. **`/admin/projects`** — 목록 + 생성/수정/삭제, 태그 멀티선택, 기술 줄 드래그 정렬(선택), 썸네일 URL 입력 또는 Firebase 업로드 컴포넌트.
3. **`/admin/certs`** — 목록 CRUD, `hasPublicLink`·`url` 일관성 검사.
4. **`/admin/guestbook`** — 목록, 행별 삭제, **전체 삭제**(트랜잭션 + 확인), `SiteSettings.guestbookSubmissionsOpen` 토글.
5. **`/admin/settings`** — 방명록 외 전역 플래그가 늘어날 때 확장.

API는 `app/api/admin/...` Route Handler 또는 Server Actions + **관리자 세션 검증** 한 곳에서만 통과.

---

## 5. Seed / 초기 데이터

- `prisma/seed.ts`: 현재 `data/skillCategories.ts`, `projects.ts`, `certs.ts`, `guestbook.ts`와 동일한 내용으로 채움.
- 프로젝트는 매 시드 시 `deleteMany` 후 재삽입(개발 편의). 운영 DB에서는 마이그레이션·백업 후 신중히 실행.
- `SiteSettings` id `1` 행 `upsert`.

**로컬에서 스키마 반영·클라이언트 생성·시드** 절차(`.env`의 `DATABASE_URL`, `db push`, `db:generate`, `db:seed`, Studio 등)는 **[prisma-local.md](./prisma-local.md)** 에 단계별로 정리해 두었습니다.

---

## 6. 추천 파일·라우트 구조 (다음 구현 단계)

```
prisma/
  schema.prisma
  seed.ts
lib/
  prisma.ts                 # PrismaClient 싱글톤
app/
  admin/
    layout.tsx              # 관리자 레이아웃(추후 인증 래퍼)
    page.tsx                # 대시보드 링크 모음
    skills/page.tsx
    projects/page.tsx
    certs/page.tsx
    guestbook/page.tsx
  api/
    guestbook/route.ts      # 공개 GET + POST (설정·검증)
    admin/
      projects/[id]/route.ts
      ...
```

Firebase: 클라이언트 또는 관리자 전용 업로드 → Storage URL 반환 → 폼이 `thumbnailUrl`에 저장.

---

## 7. 주의·확장 포인트

- **Prisma 7**: `package.json`의 `"prisma": { "seed": ... }` 가 deprecated 경고가 납니다. 이후 `prisma.config.ts`로 이전 검토.
- **DATABASE_URL**: Vercel·Neon 연동 시 환경 변수 필수. `.env.example` 참고.
- **이미지**: DB에는 URL만; `next/image` 사용 시 `remotePatterns`에 Firebase 호스트 추가.
- **방명록 off**: API에서 `guestbookSubmissionsOpen === false`면 403/503 + 프론트에서 폼 숨김/비활성화.
- **전체 삭제**: `prisma.guestbookEntry.deleteMany({})` 는 관리자 액션에서만, 이중 확인 UI 권장.
- **인증**: 본 스키마는 DB 사용자를 두지 않음. Auth.js + GitHub + `ADMIN_EMAIL` 화이트리스트 등은 `docs/admin.md` 방향과 합치면 됨.

---

## 8. 관련 문서

- [prisma-local.md](./prisma-local.md) — 로컬에서 `DATABASE_URL`·`db push`·시드
- [ERD.md](./ERD.md) — Mermaid 기반 관계도
- [data-models.md](./data-models.md) — mock 시절 타입 (DB 이전 시 본 문서와 병행 갱신)
- [admin.md](./admin.md) — 관리자 인증·배포 시크릿 (다음 단계)

---

## 부록 A. enum ↔ UI 표기 매핑 (앱 코드에서 고정)

| `SkillCategorySlug` | 기존 `data/skillCategories` `id` | 카드 제목(고정) |
|---------------------|----------------------------------|-----------------|
| `FRONTEND` | `frontend` | Frontend |
| `BACKEND` | `backend` | Backend |
| `DATA_STATE` | `data-state` | Data & State |
| `BUILD_DEPLOY` | `build-deploy` | Build & Deploy |

| `ProjectKindTag` | 기존 `statusChips` 표기 |
|------------------|-------------------------|
| `TEAM` | Team |
| `PERSONAL` | Personal |
| `IN_PROGRESS` | In Progress |

| `GuestbookBubbleColor` | 기존 문자열 키 |
|------------------------|----------------|
| `LAVENDER` | `lavender` |
| `MINT` | `mint` |
| … | … |

| `CertAvatarVariant` | 기존 `avatarVariant` |
|---------------------|------------------------|
| `HAN` | `han` |
| `GOOGLE` | `google` |
| `ANTHROPIC` | `anthropic` |
