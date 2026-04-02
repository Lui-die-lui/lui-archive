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

## 섹션 파일 (`components/sections/`)

| 섹션 | 파일 | 비고 |
|------|------|------|
| Hero | `HeroSection.tsx` | 히어로 내비·블러 배경 등 구현됨 |
| About | `AboutSection.tsx` | 라벨·메인/보조 카피 구현됨 |
| Skills | `SkillsSection.tsx` | `skillCategories` 카드 그리드 |
| Projects | `ProjectsSection.tsx` | `projects` mock 3건, 모바일 가로 스크롤 |
| Certs | `CertsSection.tsx` | `certs` mock, 링크 유무 스타일 분기 |
| Guestbook | `GuestbookSection.tsx` + `guestbook/GuestbookPanel.tsx` | mock 로그 + 로컬 추가 입력 |

## 보조 UI (`components/ui/`)

| 파일 | 용도 |
|------|------|
| `ArchiveBlurAccents.tsx` | Hero 배경 블루 블러 |
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

- `components/layout/Footer.tsx` — 푸터
- `components/layout/NavBar.tsx` — 비어 있음(히어로에 내비 포함)

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
  layout/
    Footer.tsx
    NavBar.tsx
  sections/
    HeroSection.tsx
    AboutSection.tsx
    SkillsSection.tsx
    ProjectsSection.tsx
    CertsSection.tsx
    GuestbookSection.tsx
  guestbook/
    GuestbookPanel.tsx
  ui/
    ArchiveBlurAccents.tsx
    SectionLabel.tsx
data/
  skillCategories.ts
  skills.ts
  projects.ts
  certs.ts
  guestbook.ts
  contact.ts
docs/
  README.md
  page-structure.md
  implementation.md
```

## `AGENTS.md`와의 관계

문서상 기본 순서는 Hero → About → Skills → Projects까지 강조되어 있으나, 실제 페이지는 **Certs · Guestbook · Footer**까지 동일 순서로 이어집니다.

작업 이력·구현 단계는 [implementation.md](./implementation.md)를 참고하세요.
