# 메인 페이지 구조 참조

Next.js **App Router**, 루트 구조 `app/` · `components/` · `data/` · `public/` 기준입니다.

## 설계 원칙

- **섹션 단위 컴포넌트**: `app/page.tsx`는 조립만 담당.
- **데이터 분리**: 화면에 넣을 목 데이터는 `data/`에 정의.
- **앵커 내비**: 섹션·푸터에 고정 `id`로 `#hero`, `#about` 등 이동 가능.
- **접근성**: `<section aria-labelledby="…">`와 제목 `id`를 대응.

## `app/page.tsx` 렌더 순서

1. `HeroSection`
2. `AboutSection`
3. `SkillsSection`
4. `ProjectsSection`
5. `CertsSection`
6. `GuestbookSection`
7. `Footer` — `@/components/layout/Footer`

`app/layout.tsx`에 **`SiteHeader`**(`fixed`) 포함. 히어로 본문에는 내비 중복 없음.

## 섹션 파일 (`components/sections/`)

| 섹션 | 파일 | 비고 |
|------|------|------|
| Hero | `HeroSection.tsx` | `min-h-dvh` 랜딩, 좌측 2줄 타이틀·우측 링크·하단 scroll |
| About | `AboutSection.tsx` | 서버에서 GitHub 기여 요약 fetch → `about/GithubContributionCard`, 라벨·메인/보조 카피 |
| Skills | `SkillsSection.tsx` | 중앙 헤더·`#f0f7ff` 배경. 모바일 `SkillsMobileCarousel`, `md+` 2열 그리드 + `SkillCategoryCard` |
| Projects | `ProjectsSection.tsx` | `projects` mock 3건, 모바일 가로 스크롤 |
| Certs | `CertsSection.tsx`, `CertCard.tsx` | `certs` mock, 3열 그리드, 아바타·본문 세로 정렬 규칙, 타이틀 행 우측 `링크 없음` |
| Guestbook | `GuestbookSection.tsx` + `guestbook/GuestbookPanel.tsx` | mock 로그 + 로컬 추가 입력 |

## Skills 보조 (`components/skills/`)

| 파일 | 용도 |
|------|------|
| `SkillCategoryCard.tsx` | 카테고리 카드(아이콘·제목·techStack·설명) |
| `SkillCategoryIcon.tsx` | 카테고리별 단순 SVG 아이콘 |
| `SkillsMobileCarousel.tsx` | 모바일 전용 snap 캐러셀(클라이언트) |

## About 보조 (`components/about/`)

| 파일 | 용도 |
|------|------|
| `GithubContributionCard.tsx` | GraphQL 기반 기여 요약 소형 카드(프롭만 받음, 토큰 미사용) |

## 보조 UI (`components/ui/`)

| 파일 | 용도 |
|------|------|
| `ArchiveBlurAccents.tsx` | Hero 배경 sky/blue 블러 4개(우하단 포함, 드리프트) |
| `ctaPill.ts` | 방명록·contact·소셜 캡슐 클래스 문자열 |
| `SectionLabel.tsx` | About 등 소형 섹션 라벨 |

## 앵커 `id`

| 영역 | `id` |
|------|------|
| 히어로 | `hero` (`hero-heading`) |
| 소개 | `about` (`about-heading`) |
| 스킬 | `skills` (`skills-heading`) |
| 프로젝트 | `projects` (`projects-heading`) |
| 자격 | `certs` (`certs-heading`) |
| 방명록 | `guestbook` (`guestbook-heading`) |
| 푸터 | `footer` |

## `data/` 모듈

| 파일 | 내용(현재) |
|------|------------|
| `skillCategories.ts` | 스킬 섹션 4카테고리 |
| `skills.ts` | 상세 스킬용 타입·빈 배열 |
| `projects.ts` | 프로젝트 카드 mock 3건 |
| `certs.ts` | 수료·자격 카드 mock |
| `guestbook.ts` | 방명록 엔트리·팔레트·mock |
| `contact.ts` | 푸터 연락처 mock |

## 레이아웃

- `components/layout/SiteHeader.tsx` — 전역 고정 헤더(와이어 내비)
- `components/layout/Footer.tsx` — 푸터
- `components/layout/NavBar.tsx` — 미사용 시 유지 가능

## 전역 스타일

- `app/globals.css` — 밝은 배경 톤, Geist 연동 폰트
- `app/layout.tsx` — `lang="ko"`, 폰트 변수·기본 타이포

## 디렉터리 트리(요약)

```
app/
  page.tsx
  layout.tsx
  globals.css
components/
  about/
    GithubContributionCard.tsx
  layout/
    Footer.tsx
    NavBar.tsx
  skills/
    SkillCategoryCard.tsx
    SkillCategoryIcon.tsx
    SkillsMobileCarousel.tsx
  sections/
    HeroSection.tsx
    AboutSection.tsx
    SkillsSection.tsx
    ProjectsSection.tsx
    CertsSection.tsx
    GuestbookSection.tsx
  certs/
    CertCard.tsx
  guestbook/
    GuestbookPanel.tsx
  ui/
    ArchiveBlurAccents.tsx
    ctaPill.ts
    SectionLabel.tsx
data/
  skillCategories.ts
  skills.ts
  projects.ts
  certs.ts
  guestbook.ts
  contact.ts
  githubContributions.ts
lib/
  github/
    fetchContributionSummary.ts
docs/
  README.md
  page-structure.md
  implementation.md
```

## `AGENTS.md`와의 관계

문서상 기본 순서는 Hero → About → Skills → Projects까지 강조되어 있으나, 실제 페이지는 **Certs · Guestbook · Footer**까지 동일 순서로 이어집니다.

작업 이력·구현 단계는 [implementation.md](./implementation.md)를 참고하세요.
