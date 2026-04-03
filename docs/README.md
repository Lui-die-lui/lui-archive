# 문서 인덱스

포트폴리오 **Lui Archive** 프로젝트 문서입니다. 설명·요약은 한국어로 유지합니다.

## 규정 파일 (`AGENTS.md` 기준)

| 문서 | 설명 |
|------|------|
| [overview.md](./overview.md) | 전체 페이지 구조와 섹션 역할 |
| [ui-sections.md](./ui-sections.md) | 섹션별 UI 규칙(Hero, About, Skills 등) |
| [data-models.md](./data-models.md) | mock 데이터·타입 구조 |
| [github-contributions.md](./github-contributions.md) | About GitHub 기여 카드·GraphQL 연동 입문·환경 변수 |
| [guestbook.md](./guestbook.md) | 방명록 UI/상태/동작 |
| [guestbook-main-navigation.md](./guestbook-main-navigation.md) | 방명록 → 메인 섹션 이동(인트로 스킵·해시 스크롤) |
| [cms-prisma-design.md](./cms-prisma-design.md) | CMS용 Prisma 스키마·시드·admin 모듈 단위 |
| [prisma-local.md](./prisma-local.md) | 로컬 Prisma (`db push`, `generate`, `seed`) 절차 |
| [ERD.md](./ERD.md) | DB ERD (Mermaid) |
| [admin.md](./admin.md) | 관리자 인증·보호 라우트(`/admin`)·숨은 진입 |
| [admin-projects-ui.md](./admin-projects-ui.md) | 홈 Projects — DB 편집·추가·순서(DnD)·낙관적 저장·API |
| [admin-certs-ui.md](./admin-certs-ui.md) | 홈 Certs — DB 로드·순서 변경(DnD)·API |
| [firebase-admin.md](./firebase-admin.md) | Firebase Auth·Admin·Storage 규칙·COOP·트러블슈팅 |
| [work-log.md](./work-log.md) | 작업 단위별 변경 기록 |

## 트러블슈팅

| 문서 | 설명 |
|------|------|
| [troubleshooting-guestbook-scroll.md](./troubleshooting-guestbook-scroll.md) | 방명록 → 메인 해시 이동 시 화면 흔들림 원인·해결 |
| [troubleshooting-dnd-hydration.md](./troubleshooting-dnd-hydration.md) | DnD 그립 `@dnd-kit` + Next SSR 하이드레이션 불일치 원인·해결 |

## 기타 참고

| 문서 | 설명 |
|------|------|
| [page-structure.md](./page-structure.md) | 앵커 `id`, 디렉터리 트리 |
| [implementation.md](./implementation.md) | 구현 작업 요약(히스토리) |

루트 [`AGENTS.md`](../AGENTS.md): 프레임워크 규칙, 섹션 순서, 언어·문서 규칙.
