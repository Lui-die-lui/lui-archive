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

- **제목**: `기술 스택` (`h2`, `id="skills-heading"`)
- **카드 수**: 4개 — Frontend, Backend, Data & State, Build & Deploy
- **카드 내용**: 제목(`h3`) + 짧은 설명 단락만
- **데이터**: `data/skillCategories.ts`의 `skillCategories` 배열
- **스타일**: 흰/반투명 카드, 얇은 테두리, 미세한 그림자 한 줄
- **반응형**: `grid-cols-1`(모바일 세로 스택) → `md:grid-cols-2`

---

## Projects (`ProjectsSection.tsx`)

- **제목**: `Projects` (`h2`, `id="projects-heading"`)
- **데이터**: `data/projects.ts`의 `projects` (현재 3카드)
- **카드 필드**: 제목, `statusChips`, 요약, 이미지(`image`가 `null`이면 그라데이션 플레이스홀더), `techTags`, README / LIVE 링크
- **LIVE**: `liveUrl`이 있을 때만 버튼 렌더
- **높이**: 카드 `min-h` + flex 컬럼으로 시각적 높이 정렬
- **모바일**: 가로 스크롤 + `snap-x` / `snap-center` (캐러셀 친화). `md` 이상 3열 그리드
- **배경**: `bg-white`, 상하 패딩은 Skills와 동일 계열

---

## Certs (`CertsSection.tsx`)

- **제목**: `수료 및 자격` (`h2`, `id="certs-heading"`)
- **부제**: 고정 카피 한 줄(스펙 문구)
- **데이터**: `data/certs.ts`의 `certs`
- **클릭**: `url`이 있는 카드만 `<a>`로 감싸 호버·포커스 링. `url` 없음 → `<div>`, `cursor-default`, 점선 테두리·연한 배경으로 비클릭 느낌
- **공개 링크 없음**: `url`이 없을 때 하단에 표시(SQLD 등)
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
