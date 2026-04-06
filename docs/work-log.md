# 작업 로그

최신 항목이 위에 오도록 누적합니다.

---

## 2026-04-03 — 홈 CLS: Skills 스켈레톤·Projects 스켈레톤 보강

- **코드**: `SkillsSectionSkeleton.tsx`, `app/page.tsx` — `#skills` `Suspense` fallback. `ProjectsSectionSkeleton` 카드 최소 높이·요약 줄 보강.
- **문서**: `docs/troubleshooting-performance-and-scroll.md` — CLS 절에 `#skills` 반영.

## 2026-04-03 — 홈 CLS: Projects Suspense 스켈레톤

- **코드**: `components/sections/ProjectsSectionSkeleton.tsx`, `app/page.tsx` — `ProjectsSection`용 `Suspense` fallback을 스켈레톤으로 교체해 `#projects` 구간 CLS 완화.
- **문서**: `docs/troubleshooting-performance-and-scroll.md` — CLS 절 추가·요약 표 갱신.

## 2026-04-03 — 트러블슈팅 문서: LCP·스크롤 경고

- **문서**: `docs/troubleshooting-performance-and-scroll.md` 신설 — LCP 개선 요약 표, `data-scroll-behavior` 안내. `docs/README.md` 인덱스 링크.

## 2026-04-03 — 홈 LCP: 서버 인트로 제거·섹션 Suspense

- **코드**: `app/page.tsx` — `INTRO_MIN_LOADING_MS` / `skipIntro` 서버 대기 제거, `HeroSection` 아래 `About`·`Skills`·`Projects`·`Certs`를 각각 `Suspense`로 분리해 히어로 RSC 우선 스트리밍.
- **문서**: `docs/guestbook-main-navigation.md`, `docs/implementation.md` — `skipIntro`·인트로 대기 설명 갱신.

## 2026-04-03 — 루트 README.md 실무형 재작성

- **문서**: `README.md` — 채용·협업 대상 포트폴리오 문서 양식(소개, 배포·기간, 스택, 기능, 구조, UX·트러블슈팅, 로드맵, 실행, env, 작성자). 플레이스홀더는 작성자 기입.

## 2026-04-03 — 수료 및 자격 관리자 편집·모달·유령 추가

- **코드**: `POST/PATCH/DELETE /api/admin/certs`, 제목 옆 편집 토글·일괄 수정·삭제, `CertEditForm`(모바일 인라인 / 데스크톱 `AdminDismissibleModal`), `AdminNewCertGhost*`, `SectionIntroHeader.titleAction`, `lib/cert-issued-label.ts`.
- **문서**: `docs/admin-certs-ui.md` 갱신, `docs/admin.md` API 목록.

## 2026-04-03 — 수료 및 자격(Certs) DB 로드·드래그 순서

- **코드**: `lib/certs-db.ts`, `CertsSection` → `CertsSectionClient`, `PATCH /api/admin/certs/reorder`, `CertsSectionSortableItem`(@dnd-kit·`ProjectDragGrip` 재사용).
- **문서**: `docs/admin-certs-ui.md`, `docs/README.md`, `docs/admin.md`, `docs/admin-projects-ui.md`(링크), `docs/work-log.md`.

## 2026-04-03 — 홈 Projects 관리자 UI·API 문서화

- **문서**: `docs/admin-projects-ui.md` — DB 로드·`POST`/`PATCH`/`DELETE`/reorder API, `ProjectsSectionClient`의 새 프로젝트·낙관적 저장·취소 시 즉시 숨김, `@dnd-kit` 그립 드래그 순서, 관련 파일 목록.
- **문서**: `docs/README.md` 인덱스, `docs/admin.md`(API 경로·링크), `docs/implementation.md`(변경 이력·의존성 메모), `docs/work-log.md`.

## 2026-04-03 — Prisma 로컬 절차 문서화

- **문서**: `docs/prisma-local.md` — `.env`의 `DATABASE_URL`, `db push`, `db:generate`, `db:seed`, Studio·npm 스크립트 표.
- **문서**: `docs/cms-prisma-design.md` §5에서 상세 링크, `docs/README.md` 인덱스.
- **문서**: `work-log.md`.

## 2026-04-03 — ERD 문서(Mermaid) 추가

- **문서**: `docs/ERD.md` — `prisma/schema.prisma` 기준 `erDiagram`. `docs/README.md` 인덱스 링크.
- **문서**: `work-log.md`.

## 2026-04-03 — CMS용 Prisma 스키마·시드·설계 문서(1단계)

- **코드**: `prisma/schema.prisma`, `prisma/seed.ts`, `lib/prisma.ts` 추가. `package.json`에 Prisma·시드 스크립트.
- **문서**: `docs/cms-prisma-design.md` 신설, `docs/admin.md`·`docs/data-models.md`·`docs/README.md` 갱신. `.env.example`에 `DATABASE_URL` 예시.
- **문서**: `work-log.md`.

## 2026-04-03 — 방명록 입력 박스 높이 축소

- **코드**: `GuestbookPanel` 메시지 영역 `rows`·`min-h`·내부 패딩·구분선·하단 여백·전송 버튼 크기 조정으로 입력 카드 세로 높이 감소.
- **문서**: `work-log.md`.

## 2026-04-03 — 방명록 → 메인 섹션 내비(인트로 스킵·앵커 보정) 문서화

- **내용**: 방명록에서 헤더 메뉴로 메인 `/#섹션` 이동 시 쿠키 방식의 한계, `?skipIntro=1` 쿼리 + `ScrollToHash` 보정, 관련 파일 목록을 `docs/guestbook-main-navigation.md`에 정리.
- **문서**: `docs/guestbook.md`(링크 추가), `docs/README.md`(인덱스), `docs/work-log.md`.

## 2026-04-03 — Guestbook 전용 라우트 분리 + 중앙 레이아웃 정돈

- **코드**: `app/page.tsx`에서 `GuestbookSection` 제거 후 `/guestbook` 진입 버튼만 노출. `SiteHeader` 방명록 링크를 `#guestbook` → `/guestbook`로 변경.
- **코드**: `app/guestbook/page.tsx` 신설로 방명록 전체(목록 + 작성 폼)를 전용 페이지에서 렌더.
- **코드**: `GuestbookSection` 및 `GuestbookPanel` 레이아웃을 중앙 정렬·카드형 구성으로 조정(리스트 스크롤 영역 + 입력 폼을 시각적으로 분리).
- **문서**: `docs/page-structure.md`, `docs/overview.md`, `docs/implementation.md`, `docs/ui-sections.md`, `docs/guestbook.md` 갱신.

## 2026-04-03 — Projects와 Certs 사이 구분선 제거

- **코드**: `ProjectsSection`의 하단 `border-b`를 제거해서 `Projects`와 `Certs` 사이 구분선을 없앰.
- **문서**: `work-log.md`.

## 2026-04-03 — Skills 그리드 카드 패딩·정렬(참고 시안)

- **코드**: `SkillCategoryCard` 그리드 전용 `cardShellGrid`(왼쪽 정렬). 패딩 `md:px-12 md:py-10`, 제목·tech·설명 간격 `mt-2`/`mt-3`, `justify-center`로 본문 블록 세로 중앙. `min-h`·`line-clamp` 제거로 자연 높이. `SkillsSection` 그리드 `lg:max-w-[42rem]`.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — fallback(폴백) 규칙 문서화

- **코드**: (변경 없음) `ProjectCard`의 `ThumbFallback`·`STATUS_CHIP_FALLBACK`와 `CertCard`의 `hasPublicLink === false` 처리(“링크 없음” 배지)를 `docs/ui-sections.md`에 규칙으로 정리.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — Skills·Projects 카드 본문 타이포 복원

- **코드**: 전역 `md` 타이포 축소 때 같이 줄었던 `SkillCategoryCard`(그리드)·`ProjectCard` 내부 글자를 이전 가독성 수준으로 되돌림(제목·techStack·설명·요약·태그·CTA 등). 카드 높이 맞춤용 `line-clamp`·`min-h`는 유지.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — Certs 링크 없음 배치·세로 정렬

- **코드**: `CertCard`에서 `hasPublicLink === false`일 때 하단 문구 제거, 타이틀 오른쪽에 `링크 없음` 배지. 카드 `items-stretch`, 아바타 열 `items-center`, 본문 `justify-center`로 세로 정렬 규칙 명시. `data/certs.ts` 주석 정리.
- **문서**: `data-models.md`, `ui-sections.md`, `implementation.md`, `overview.md`, `page-structure.md`, `work-log.md`.

---

## 2026-04-03 — Certs 스크린샷 정합·데이터·UI

- **코드**: `data/certs.ts`를 SQLD·Google AI Essentials·Anthropic 3건 등 5건으로 교체, `CertAvatarVariant`·`avatarText` 추가. `CertCard` 신설(가로 레이아웃·아바타 색조). `CertsSection`에 `SectionLabel` **Certs**·Projects와 동일 중앙 헤더·`lg:grid-cols-3` 그리드.
- **문서**: `data-models.md`, `ui-sections.md`, `implementation.md`, `overview.md`, `page-structure.md`, `work-log.md`.

---

## 2026-04-03 — Skills 모바일 캐러셀·데이터·헤더 정리

- **코드**: `skillCategories`에 `techStack`·스크린샷 문구 반영. `SkillCategoryCard`·`SkillCategoryIcon`·`SkillsMobileCarousel`(snap·dots·이전다음·키보드). `SkillsSection` 중앙 헤더·`bg-[#f0f7ff]`, `md+` 그리드 / 모바일 캐러셀 분기.
- **문서**: `data-models.md`, `ui-sections.md`, `page-structure.md`, `overview.md`, `work-log.md`.

---

## 2026-04-03 — About 섹션 가로 중앙 정렬

- **코드**: `AboutSection` `.site-container`에 `flex flex-col items-center text-center`, `SectionLabel`에 `w-full text-center`. `GithubContributionCard`에서 `w-full` 제거해 카드가 중앙에 오도록 함.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — GitHub 기여 카드 사이즈 업(와이어 비례)

- **코드**: `GithubContributionCard` 폭·패딩·그리드 셀·타이포·그림자 확대(`max-w-[20rem]`/`22rem`, 셀 10px/12px).
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — `github-contributions.md` GraphQL·연동 입문 정리

- **문서**: REST 대비 GraphQL, 엔드포인트·POST·Bearer, `query`/`variables`/응답 `data`·`errors`, 이 레포의 쿼리 구조·데이터 흐름·토큰 발급 힌트 추가.

---

## 2026-04-03 — GitHub 카드 Total 제거·This year 강조

- **코드**: `ContributionSummary`에서 `total` 제거, GraphQL에서 `totalCommitContributions` 조회 제거. 카드 상단을 **This year:**, 그 아래 **Today**.
- **문서**: `github-contributions.md`, `data-models.md`, `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — GitHub GraphQL 오류 완화(달력·total 분리·level 클라 산출)

- **코드**: `contributionLevel` 제거, `totalPart`/`calendarPart` 별칭으로 기간 분리, count 기반 0~4 레벨. dev에서 GraphQL 오류는 `JSON.stringify`로 로그.
- **문서**: `github-contributions.md`, `work-log.md`.

---

## 2026-04-03 — GitHub 기여 fetch `viewer` 전환·env 정규화

- **코드**: GraphQL을 `user(login)` → **`viewer`**로 변경(토큰 계정과 불일치 시 미반영 문제 완화). `sanitizeEnv`로 따옴표 제거, `noStore` + 개발 시 `cache: 'no-store'`. `fetchContributionSummary` 반환에 `displayHandle`(성공 시 `viewer.login`).
- **문서**: `github-contributions.md`, `work-log.md`.

---

## 2026-04-03 — About GitHub 기여 카드(GraphQL·서버 전용)

- **코드**: `data/githubContributions.ts`(타입), `lib/github/fetchContributionSummary.ts`(GraphQL·가공), `components/about/GithubContributionCard.tsx`, `AboutSection`을 async로 fetch 연동. `.env.example`에 `GITHUB_USERNAME` / `GITHUB_TOKEN`.
- **문서**: `github-contributions.md` 신설, `data-models.md`, `ui-sections.md`, `overview.md`, `page-structure.md`, `implementation.md`, `work-log.md` 갱신.

---

## 2026-04-03 — contact 타이포 확대·히어로 블러 우하단

- **코드**: `ctaPillSizeLg` 글자·패딩·높이 상향. `ArchiveBlurAccents`에 `archive-blob-4`(우하단 `sky-200`), `globals.css`에 드리프트 타이밍.
- **문서**: `ui-sections.md`, `page-structure.md`, `work-log.md`.

---

## 2026-04-03 — contact 캡슐 확대·히어로 블러 존재감

- **코드**: `ctaPillGlassContactButton`(`h-9`/`md:h-10`). `ArchiveBlurAccents` 블롭 크기·`/opacity` 상향 및 위치 미세 조정으로 블루 톤이 더 보이게.
- **문서**: `ui-sections.md`, `page-structure.md`, `work-log.md`.

---

## 2026-04-03 — CTA 캡슐 크기 통일·방명록·contact 글라스

- **코드**: `components/ui/ctaPill.ts`에 공통 `h-8`·타이포(`ctaPillSize`). 소셜은 `ctaPillSocialBase`, 방명록·contact는 `ctaPillGlassButton`(반투명·`backdrop-blur-md`·인셋 하이라이트). `SiteHeader` 방명록·`HeroSection` contact·github/velog에 적용.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — Hero GitHub·Velog 캡슐 버튼 상단·브랜드 호버

- **코드**: `HeroSection`에서 본문 옆 링크 제거, `.site-container` 상단 우측에 검은 캡슐(`github` / `velog`), `transition`으로 호버 시 `#238636`·`#20C997`.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — Hero 본문 세로 중앙 정렬

- **코드**: `HeroSection`에서 `flex-1` + `justify-center`로 메인 콘텐츠를 뷰포트(헤더 제외) 안 세로 중앙에 배치, 스크롤 힌트는 하단 `shrink-0`.
- **문서**: `ui-sections.md`, `work-log.md`.

---

## 2026-04-03 — 콘텐츠 폭 확장 · 블러 색상 복원

- **코드**: `globals.css`에 `.site-container`(`max-w-7xl` + 반응형 패딩). 헤더·히어로·About~Guestbook·푸터에 적용. `ArchiveBlurAccents`를 `bg-sky-200/45`·`bg-blue-100/55`·`bg-sky-100/35` 이전 톤으로 복원(3블롭). 프로젝트 모바일 카드 폭 `calc`를 패딩에 맞게 조정.
- **문서**: `ui-sections.md`, `page-structure.md`, `work-log.md`.

---

## 2026-04-03 — Hero 와이어프레임 1차 기준 재정렬

- **코드**: `SiteHeader` 신설·`layout` 연동. `HeroSection`을 `min-h-dvh` 랜딩으로 확장, 좌측 `Lui`/`Archive` 2줄 타이틀·와이어 카피·작은 `contact`만(리퀴드 메탈 제거). 우측 상단 `github`/`velog` 소형 블록. `ArchiveBlurAccents` 넓은 저채도 블루 4덩어리 + `globals.css` 드리프트/스크롤 힌트. `data/contact.ts` GitHub·Velog URL 시안 URL.
- **문서**: `ui-sections.md`, `page-structure.md`, `work-log.md`.

---

## 2026-04-03 — Guestbook 대화형 UI · Footer 연락처

- **코드**: `data/guestbook.ts` 스키마·mock·파스텔 팔레트·관리자 고정 말풍선. `GuestbookPanel`(클라이언트) 로그+폼, `GuestbookSection` 연결. `data/contact.ts` + `Footer` 이메일·GitHub·Velog·Instagram. 히어로 Contact → `#footer`.
- **문서**: `guestbook.md`, `data-models.md`, `ui-sections.md`, `overview.md`, `implementation.md`, `work-log.md`, `page-structure.md` 갱신.

---

## 2026-04-03 — Projects / Certs 섹션 및 mock 데이터

- **코드**: `data/projects.ts`, `data/certs.ts` 타입·목 데이터 정의. `ProjectsSection`(3카드, LIVE 조건부, 모바일 snap 스크롤), `CertsSection`(제목·부제, url 유무에 따른 카드 스타일, `공개 링크 없음`).
- **문서**: `data-models.md`, `ui-sections.md`, `overview.md`, `page-structure.md`, `implementation.md`(플레이스홀더 구간), `work-log.md` 갱신.

---

## 2026-04-03 — Hero / About / Skills 규격 확인 및 문서 정비

- **코드**: `HeroSection`, `AboutSection`, `SkillsSection`은 이미 와이어 방향(밝은 톤, 히어로 블러, 4카드 스킬, About 카피)에 맞게 구현된 상태로 확인. 추가 코드 변경 없음.
- **문서**: `AGENTS.md`의 Documentation rules에 맞춰 `overview.md`, `ui-sections.md`, `data-models.md`, `guestbook.md`, `admin.md`, `work-log.md` 신규 작성. `docs/README.md` 인덱스 갱신.

---

## 이전 — 스켈레톤·초기 섹션·구현 요약

- 페이지 섹션 연결, `implementation.md` / `page-structure.md` 초안 등은 [implementation.md](./implementation.md) 참고.
