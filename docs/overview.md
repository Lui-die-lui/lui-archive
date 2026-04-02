# 전체 페이지 구조와 섹션 역할

## 기술·구조

- **프레임워크**: Next.js App Router
- **루트 디렉터리**: `app/`, `components/`, `data/`, `public/` (`src/` 미사용)

## `app/page.tsx` 섹션 순서

| 순서 | 섹션 | `id` | 역할(요약) |
|------|------|------|------------|
| 1 | Hero | `hero` | 브랜딩, 앵커 내비, 외부 링크 자리, 메인 타이틀·소개 |
| 2 | About | `about` | 소개 라벨, GitHub 기여 소형 카드(서버 API), 메인·보조 카피 |
| 3 | Skills | `skills` | 기술 스택 카테고리 카드(4개) |
| 4 | Projects | `projects` | 프로젝트 카드 3건, mock 데이터·가로 스크롤(모바일) |
| 5 | Certs | `certs` | 수료·자격 카드, 링크 유무에 따른 클릭 스타일 |
| 6 | Guestbook | `guestbook` | 아카이브형 방명록 로그 + 로컬 mock 입력([guestbook.md](./guestbook.md)) |
| 7 | Footer | `footer` | 연락처 전용(이메일·SNS 링크, `data/contact.ts`) |

## 시각·톤(공통)

- 밝은 배경(`#fafbfd` / `white` 교차), 아카이브 느낌의 절제된 타이포
- 히어로에만 소프트 블루 블러 악센트(`ArchiveBlurAccents`)
- 불필요한 모션·애니메이션 없음(호버 색·테두리 정도만)

## 관련 문서

- UI 세부: [ui-sections.md](./ui-sections.md)
- 데이터 타입·mock: [data-models.md](./data-models.md)
- GitHub 기여(About): [github-contributions.md](./github-contributions.md)
- 앵커·파일 트리: [page-structure.md](./page-structure.md)
