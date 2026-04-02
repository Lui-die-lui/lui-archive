# 작업 로그

최신 항목이 위에 오도록 누적합니다.

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
