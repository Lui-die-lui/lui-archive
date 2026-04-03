# 섹션별 UI 규칙

구현 파일: `components/sections/*.tsx`, 보조 UI: `components/ui/*.tsx`

## 전역 콘텐츠 폭 (`app/globals.css`)

- **`.site-container`**: `max-w-7xl`(1280px) + `px-5 sm:px-6 lg:px-8` — [CherryPlan 3D 랜딩](https://3dsite-ivory.vercel.app/)류와 비슷하게 **이전보다 넓은** 메인 폭
- 헤더·히어로·본문 섹션·푸터에서 공통 사용

---

## 글로벌 헤더 (`SiteHeader.tsx`, `app/layout.tsx`)

- **와이어 정합**: 좌 `Lui Arc.` · 중앙 `intro` / `skills` / `works` / `certs` · 우 **방명록**(얇은 필, 리퀴드 메탈 없음)
- **방명록 버튼**: `ctaPillGlassButton`(`h-8`) — 소셜과 **같은 크기**, **글라스**(반투명·`backdrop-blur-md`·인셋 하이라이트·호버 진해짐)
- **스타일**: `fixed`, 매우 연한 반투명 + `backdrop-blur` (무거운 바 지양)
- **`md` 이상**: 중앙 내비는 뷰포트 중앙 정렬(`absolute` + `-translate-x-1/2`)
- **모바일**: 첫 행(로고·방명록) 아래에 가로 스크롤 가능한 동일 4링크 행(높이 과다 방지)

## Hero (`HeroSection.tsx`)

- **높이**: `min-h-dvh` + 고정 헤더 높이만큼 `padding-top`(`pt-[calc(3rem+2.25rem)]` 모바일 2행, `md:pt-[3.25rem]` 단일 행) — 첫 화면을 채우는 **넓은 랜딩**. 상단 행에 **github / velog** 검은 캡슐 버튼(`.site-container` 우측 정렬) 후, 본문(타이틀·설명·contact)은 **가용 높이 안에서 `justify-center`로 세로 중앙**, 하단 `scroll` 힌트는 `shrink-0`으로 아래 고정
- **정렬**: 본문 블록 **좌측 정렬**(`text-left`), 중앙 몰림 없음
- **타이틀**: `Lui` / `Archive` **두 줄**(`h1` 내 `span` 2개), `clamp`로 큰 표시 크기
- **영문 태그라인**: `Fullstack junior dev with a design-driven mind.` (상단)
- **한글 설명**: 와이어 문구(흐름·화면·기능 연결)
- **contact**: `ctaPillGlassContactButton`(`h-10`·`md:h-11`, `text-[0.875rem]`·`md:text-sm`) + `lowercase`, `#footer` — 방명록과 **같은 글라스 스킨**, **크기·글자만 큼** — **Liquid Metal 미사용**
- **소셜**: 내비 바로 아래·히어로 **상단 우측**에 `github` / `velog` — `ctaPillSocialBase`로 **방명록과 같은 `h-8`**, 스타일만 검정 캡슐 + 호버 시 GitHub `#238636`, Velog `#20C997`(`data/contact.ts` 링크)
- **배경**: `ArchiveBlurAccents` — `sky-200`·`blue-100`·`sky-100` **블러 4덩어리**(우하단 `archive-blob-4`로 살짝 채움), `z-0`·느린 드리프트(`prefers-reduced-motion` 대응)
- **스크롤 힌트**: 하단 **중앙**, 세로 `scroll` + 아래로 갈수록 진해지는 작은 화살표 + 약한 바운스
- **컨테이너**: `.site-container`(`max-w-7xl` + 반응형 패딩)

---

## About (`AboutSection.tsx`)

- **섹션 라벨**: `SectionLabel`을 `h2` + `id="about-heading"` + `className="w-full text-center"` (접근성·`#about` 앵커 유지)
- **라벨 텍스트**: `About`
- **GitHub 기여 카드**: `GithubContributionCard` — 라벨 바로 아래, 보조 카드 **`max-w-[20rem]` / `md:max-w-[22rem]`**, `rounded-2xl`·`p-5`/`md:p-6`. **This year:** 한 줄 굵은 표기(`text-base`/`md:text-lg`) + **Today**(`text-sm`/`md:text-[0.9375rem]`). 5×7 블록 **`size-[10px]`/`md:size-3`**, `gap-1`/`md:gap-1.5`. `fetchContributionSummary()` ([github-contributions.md](./github-contributions.md)). 실패 시 `—`·빈 그리드
- **메인 카피**(큰 본문):  
  「끊임없이 탐구하며, 꾸준함을 결과로 만듭니다.」(줄바꿈 유지)
- **보조 카피**: 그 아래 작은 회색 단락
- **금지**: 기술 뱃지·아이콘 난립 없음
- **레이아웃**: `.site-container`에 `flex flex-col items-center text-center`로 **가로 중앙 스택**. `py-24` / `md:py-32`, 본문은 `max-w-xl`·`max-w-lg`로 읽기 폭 제한

---

## Skills (`SkillsSection.tsx`)

- **톤·배경**: 섹션 `bg-[#f0f7ff]`, 헤더는 `SectionLabel`(Skills → `SKILLS`) + `h2`「기술 스택」+ 부제 한 단락, **가운데 정렬**
- **제목**: `기술 스택` (`h2`, `id="skills-heading"`)
- **카드 수**: 4개 — Frontend, Backend, Data & State, Build & Deploy
- **카드 UI**: `SkillCategoryCard` — 모바일 캐러셀은 가운데 정렬·별도 크롬. **그리드(`md+`)** 는 `rounded-3xl`·얇은 테두리·흰 배경, 본문 **왼쪽 정렬**
- **그리드 카드 패딩·간격**: `px-6 py-8`, `md:px-12 md:py-10`(참고안에 가깝게 넉넉한 인셋). 제목→techStack `mt-2`, techStack→설명 `mt-3`. 카드는 `justify-center`로 텍스트 블록을 세로 중앙에 두고, 행 높이가 맞을 때 여백이 위·아래로 균형 있게 잡힘
- **카드 타이포(그리드)**: 제목 `md:text-xl`, techStack·설명은 위계 유지(`md:text-base` 설명 등)
- **데이터**: `data/skillCategories.ts`의 `skillCategories`
- **데스크톱/태블릿 (`md+`)**: `hidden md:grid` **1열** 스택, 리스트 `lg:max-w-[42rem]`
- **모바일 (`md` 미만)**: `SkillsMobileCarousel`(클라이언트) — `snap-x snap-mandatory` 가로 스크롤, 슬라이드 너비 `min(22rem, 100vw-3.25rem)`로 **옆 카드 살짝 노출**, `IntersectionObserver`로 **활성 점(dots)** , **이전/다음** 원형 버튼, 영역 `tabIndex={0}` + **좌우 화살표 키**. 카드 `min-h`로 높이 들쭉날쭉 완화

---

## Projects (`ProjectsSection.tsx`)

- **제목**: `Projects` (`h2`, `id="projects-heading"`)
- **데이터**: `data/projects.ts`의 `projects` (현재 3카드)
- **카드 필드**: 제목, `statusChips`, 요약, 이미지(`image`가 `null`이면 그라데이션 플레이스홀더), `techTags`, README / LIVE 링크
- **LIVE**: `liveUrl`이 있을 때만 버튼 렌더
- **높이**: 카드 `min-h` + flex 컬럼으로 시각적 높이 정렬
- **카드 타이포**: `ProjectCard` 본문(제목·요약·태그·README/LIVE)은 데스크톱에서도 과도하게 축소하지 않음(예: 제목 `md:text-base`, 요약 `md:text-sm`, 태그·버튼 `11px` 유지)
- **모바일**: 가로 스크롤 + `snap-x` / `snap-center` (캐러셀 친화). `md` 이상 3열 그리드
- **배경**: `bg-white`, 상하 패딩은 Skills와 동일 계열

---

## 폴백(Fallback) 규칙

- **프로젝트 썸네일 폴백**: `ProjectCard`에서 `project.image === null`이면 `ThumbFallback`을 렌더합니다(그라데이션 박스 + 제목 라벨로 대체).
- **상태 칩 폴백**: `ProjectCard`에서 `statusChips` 값이 `STATUS_CHIP_STYLES`에 없으면 기본 스타일 `STATUS_CHIP_FALLBACK`을 적용합니다.
- **인증/링크 폴백(자격증)**: `CertCard`에서 `hasPublicLink === false`이면 카드 전체 링크를 만들지 않고, 대신 카드 내부에 `링크 없음` 배지를 표시합니다.

---

## Certs (`CertsSection.tsx` + `CertCard.tsx`)

- **헤더**: Projects·Skills와 동일 패턴 — 중앙 `SectionLabel` **Certs**, `h2` **수료 및 자격**, 부제 한 줄
- **그리드**: `lg:grid-cols-3`, `md:grid-cols-2`, 모바일 1열(첫 줄 3·둘째 줄 2 배치)
- **카드**: 연한 블루그레이 배경·얇은 테두리·둥근 모서리. **왼쪽 원형 아바타**(`avatarVariant`별 색) + 오른쪽 제목·`발급처 · issuedAt` 한 줄
- **클릭**: `url` 있으면 카드 전체 `<a>`, 호버 시 테두리·배경 살짝 진하게. `url` 없으면 `<div>`·`cursor-default`
- **링크 없음**: `hasPublicLink === false`일 때 타이틀과 한 줄(`items-center`)로 두고, 오른쪽에 `링크 없음` 배지(SQLD 등)
- **세로 정렬**: 카드는 `items-stretch`로 행 높이에 맞춤. 아바타는 좌측 열에서만 `items-center`로 원을 세로 중앙에 두고, 본문 열은 `justify-center`로 제목·발급 정보 블록을 세로 중앙에 배치
- **배경**: `bg-[#fafbfd]`

---

## Guestbook (`GuestbookSection.tsx` + `GuestbookPanel.tsx`)

- **제목**: `방명록` (`h2`, `id="guestbook-heading"`)
- **UI**: 아카이브 로그형 스크롤 영역 + 하단 입력(닉네임·메시지·파스텔 색 5종)
- **정렬**: `admin` 왼쪽 고정색 말풍선, `guest` 오른쪽 선택 색 말풍선
- **실시간 UI 없음**: 타이핑/온라인/읽음 표시 없음
- **배경**: `bg-white`, 섹션 패딩은 다른 본문 섹션과 동일 계열
- **상세**: [guestbook.md](./guestbook.md)

---

## Footer (`components/layout/Footer.tsx`)

- **역할**: **연락처만** — 이메일(`mailto`) + GitHub / Velog / Instagram 텍스트 링크
- **데이터**: `data/contact.ts`의 `contact`
- **앵커**: `id="footer"`, 히어로 **Contact** 버튼은 `href="#footer"`
- **스타일**: `border-t`, `bg-[#fafbfd]`, `max-w-5xl` 정렬

---

## 미구현·플레이스홀더

- (없음 — 상단 Hero 보조 링크는 푸터와 별도로 유지 가능)
