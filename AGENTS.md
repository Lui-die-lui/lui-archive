<!-- BEGIN: nextjs-agent-rules -->

# Portfolio Project Rules

## Framework / structure
- This project uses Next.js App Router.
- Do not migrate files into `src/` unless explicitly requested.
- Keep the current root structure (`app/`, `components/`, `data/`, `public/`) intact.
- Prefer small, focused section components over monolithic page files.
- Separate UI components and mock data into different files.

## Current page structure
The main portfolio page should keep this section order:

1. Hero
2. Introduce / About
3. Skills
4. Projects

## Language rules
- Always respond in Korean unless explicitly asked to use another language.
- Write explanations, summaries, and implementation notes in Korean.

## Documentation rules
- 모든 의미 있는 작업은 `docs/` 디렉토리의 문서 업데이트를 포함해야 한다.
- 코드만 수정하고 문서를 생략하지 않는다.
- 문서가 아직 없다면 새로 생성하고, 이미 있다면 기존 문서를 업데이트한다.
- 작업이 끝나면 변경된 코드 파일뿐 아니라 변경되거나 생성된 문서 파일도 함께 보고한다.
- 설명, 변경 요약, 문서 내용은 모두 한국어로 작성한다.

## Docs directory conventions
- `docs/overview.md`: 전체 페이지 구조와 섹션 역할
- `docs/ui-sections.md`: 각 섹션 UI 규칙 정리
- `docs/data-models.md`: mock data / DB 연결 전 데이터 구조 정리
- `docs/guestbook.md`: 방명록 UI/상태/동작 규칙 정리
- `docs/admin.md`: 추후 admin 인증 및 관리 구조 정리
- `docs/work-log.md`: 작업 단위별 변경 기록 누적