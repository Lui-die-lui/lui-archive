# 작업 로그

최신 항목이 위에 오도록 누적합니다.

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
