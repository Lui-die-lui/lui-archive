# 섹션별 UI 규칙

구현 파일: `components/sections/*.tsx`, 보조 UI: `components/ui/*.tsx`

---

## Hero (`HeroSection.tsx`)

- **로고 문구**: `Lui Arc.` (상단 좌측 느낌의 텍스트 로고)
- **내비**: `intro` → `#about`, `skills` → `#skills`, `works` → `#projects`, `certs` → `#certs`, `방명록` → `#guestbook`
- **우측 링크**: `GitHub`, `Velog` 텍스트 링크(현재 `href="#"` 플레이스홀더)
- **메인 타이틀**: `Lui Archive` (`h1`, `id="hero-heading"`)
- **설명**: 짧은 단락 1개
- **Contact**: 테두리 버튼 스타일의 링크 플레이스홀더
- **배경**: `bg-[#fafbfd]` + `ArchiveBlurAccents` (블루 블러 오브 3개)
- **레이아웃**: `max-w-5xl`, `px-6`, 상단 헤더는 모바일 세로 스택 → `md` 이상 가로 정렬

---

## About (`AboutSection.tsx`)

- **섹션 라벨**: `SectionLabel`을 `h2` + `id="about-heading"`으로 사용(접근성과 시각 라벨 일치)
- **라벨 텍스트**: `About`
- **메인 카피**(큰 본문):  
  「끊임없이 탐구하며, 꾸준함을 결과로 만듭니다.」(줄바꿈 유지)
- **보조 카피**: 그 아래 작은 회색 단락
- **금지**: 기술 뱃지·아이콘 난립 없음
- **레이아웃**: 넉넉한 `py-24` / `md:py-32`, `max-w-xl`~`lg`로 읽기 폭 제한

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
