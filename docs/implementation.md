# 구현 작업 정리

Next.js App Router 기반 포트폴리오에서 **현재까지 반영된 작업**을 단계별로 정리합니다. (의존성 추가 없이 진행.)

---

## 1. 페이지 스켈레톤 및 연결

- **목표**: `app/page.tsx`에서 섹션만 순서대로 조립하고, 시맨틱 마크업·스크롤용 `id`를 부여.
- **섹션 순서** (변경 없이 유지):
  1. `HeroSection`
  2. `AboutSection`
  3. `SkillsSection`
  4. `ProjectsSection`
  5. `CertsSection`
  6. `GuestbookSection`
  7. `Footer` (`components/layout/Footer.tsx`)
- **데이터 분리**: 목·mock 데이터는 `data/`에 두고, UI는 `components/sections/`에 둠.
- **접근성**: 각 `<section>`에 `aria-labelledby`, 제목 요소에 대응 `id` 부여.

---

## 2. 문서 폴더(`docs/`) 최초 정리

- `docs/README.md`: 문서 목차.
- `docs/page-structure.md`: 앵커 `id`, 파일 트리, 데이터 파일 역할 등 구조 설명.

이후 구현이 늘어남에 따라 `page-structure.md`와 본 문서(`implementation.md`)를 함께 갱신하는 것을 권장합니다.

---

## 3. Hero · About · Skills 구현

### 공통 방향

- **톤**: 차분한 아카이브 느낌, **밝은 배경**, 소프트 블루 블러만 사용(과한 애니메이션·다크 테마 지양).
- **레이아웃**: `max-w-5xl`, `px-6`, 섹션 간 `border-b`·배경 교차(`bg-white` / `bg-[#fafbfd]`) 등 기존 와이어에 가깝게 유지.

### Hero (`HeroSection.tsx`)

- 로고 문구: **Lui Arc.**
- 내비: intro / skills / works / certs / 방명록 → `#about`, `#skills`, `#projects`, `#certs`, `#guestbook`
- 우측 텍스트 링크: GitHub, Velog(현재 `href="#"` 플레이스홀더)
- 메인 타이틀: **Lui Archive**, 짧은 설명 문단, Contact 플레이스홀더 버튼
- 배경: `ArchiveBlurAccents`로 연한 블루 블러 오브

### About (`AboutSection.tsx`)

- **GitHub 기여**: `lib/github/fetchContributionSummary.ts`에서 GraphQL로 `ContributionSummary` 조회(환경 변수 `GITHUB_USERNAME`, `GITHUB_TOKEN`, 서버 전용). `GithubContributionCard`로 소형 카드만 표시.
- 상단 라벨: `SectionLabel` 컴포넌트(`as="h2"`, `id="about-heading"`)
- 메인 카피:  
  「끊임없이 탐구하며, 꾸준함을 결과로 만듭니다.」
- 보조 문단: 여백 위주의 미니멀 레이아웃, 기술 뱃지 없음

### Skills (`SkillsSection.tsx`)

- 헤더: `SectionLabel`(Skills) + **기술 스택** + 부제, 중앙 정렬, 배경 `#f0f7ff`
- 카드 4개: `SkillCategoryCard`(아이콘·제목·`techStack`·설명)
- 데이터: `data/skillCategories.ts`(`techStack` 포함)
- 반응형: **`md` 미만** `SkillsMobileCarousel`(snap·dots·버튼), **`md+`** 2열 그리드

### 재사용 UI

| 파일 | 역할 |
|------|------|
| `components/ui/ArchiveBlurAccents.tsx` | 히어로용 블루 블러 레이어(`pointer-events-none`, `aria-hidden`) |
| `components/ui/SectionLabel.tsx` | 섹션 소제목 스타일(`p` / `h2` 선택 가능) |

### 전역·레이아웃

- `app/globals.css`: 밝은 배경(`#fafbfd` 계열), OS 다크모드에 따른 자동 반전 제거, 본문 폰트를 Geist 계열로 정리
- `app/layout.tsx`: `lang="ko"`, `body`에 `font-sans`·기본 글자색 정리

---

## 4. Projects · Certs 섹션

- **Projects**: `data/projects.ts`에 카드용 필드 전체 정의, 3건 mock. `ProjectsSection`에서 모바일 `snap` 가로 스크롤·데스크톱 3열, `liveUrl` 없으면 LIVE 버튼 미표시.
- **Certs**: `data/certs.ts`에 제목·발급기관·일자·`url`·`hasPublicLink` 정의. `CertsSection`에서 `url` 있으면 링크 카드, 없으면 비클릭 스타일 + `공개 링크 없음`.

### Guestbook · Footer

- **Guestbook**: `GuestbookPanel`에서 시간순 로그, admin 좌·guest 우, 파스텔 팔레트 선택, 제출은 클라이언트 상태만 갱신(mock).
- **Footer**: `data/contact.ts` 기반 이메일·SNS만 표시. 히어로 Contact는 `#footer`.

---

## 5. 아직 플레이스홀더인 부분

| 영역 | 상태 |
|------|------|
| `components/layout/NavBar.tsx` | 비어 있음(히어로 내비 사용) |
| `data/skills.ts` | 상세 스킬 목록용으로 비워 둔 상태(카테고리 카드는 `skillCategories` 사용) |

---

## 6. 데이터·타입 요약 (현재)

| 파일 | 용도 |
|------|------|
| `data/skillCategories.ts` | 스킬 섹션 4카드(제목·techStack·설명) |
| `data/skills.ts` | 향후 상세 스킬 리스트용(현재 빈 배열) |
| `data/projects.ts` | 프로젝트 카드 mock(Omijoy, Odyssey Plan, MU:ZIN 등) |
| `data/certs.ts` | 수료·자격 카드 mock |
| `data/guestbook.ts` | 방명록 엔트리·파스텔 팔레트·관리자 말풍선 스타일 |
| `data/contact.ts` | 푸터 연락처 mock |

---

## 7. 빌드·규칙

- **의존성**: 본 작업 범위에서 새 패키지 추가 없음.
- **구조**: `src/`로 이전하지 않음; `app/`, `components/`, `data/`, `public/` 루트 구조 유지.
- **언어**: 사용자·`AGENTS.md` 규칙에 따라 설명·문서는 **한국어** 우선.

---

## 8. `AGENTS.md` 문서 규약 파일

`docs/README.md`에서 안내하듯, 다음 파일로 역할을 나눕니다.

- `overview.md`, `ui-sections.md`, `data-models.md`, `guestbook.md`, `admin.md`, `work-log.md`

세부 규칙·최신 변경은 [work-log.md](./work-log.md)를 참고합니다.

---

## 변경 이력(문서 관점)

| 시점 | 내용 |
|------|------|
| 초기 | 스켈레톤 + `docs/` 초안 |
| 중간 | Hero / About / Skills + UI 보조 컴포넌트 + 전역 톤 |
| 본 문서 추가 | 위 내용을 `implementation.md`로 통합 정리 |
| 규약 정비 | `AGENTS.md`의 Docs directory conventions 반영 |
| Projects/Certs | mock 데이터·섹션 UI·관련 문서 갱신 |
