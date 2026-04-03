# Projects 섹션 — DB 연동·관리자 UI·순서 변경

홈의 **Projects**(`/#projects`)는 Prisma `Project` 행이 있으면 DB에서, 없거나 오류 시 `data/projects.ts` mock을 씁니다. **관리자 세션**이 있을 때만 카드에 편집·추가·순서 변경 UI가 노출됩니다.

---

## 데이터 흐름

| 구분 | 설명 |
|------|------|
| 서버 로드 | `lib/projects-db.ts`의 `getProjectsForHome()` — `sortOrder` 오름차순, `tagLinks`·`techLines` 포함 조회 후 `data/projects.ts`의 `Project` 타입으로 매핑 |
| 공개 식별자 | DB `publicId`가 카드·API·Firebase Storage 경로에서 쓰이는 `Project.id`와 동일 |
| 정렬 | `Project.sortOrder` (정수, 0부터 연속 권장). 목록 순서는 이 값 기준 |

`persistedPublicIds`: DB에 행이 있는 `publicId` 집합. 관리자라도 mock-only 카드는 `canMutate === false`로 수정 API를 쓰지 않습니다.

---

## API (관리자 쿠키 필요)

공통: `lib/admin-auth.ts`의 `requireAdmin()`. 실패 시 401/503 등.

| 메서드 | 경로 | 역할 |
|--------|------|------|
| `POST` | `/api/admin/projects` | 최소 필드로 행 생성. 기본 제목 `새 프로젝트`, 요약·README 플레이스홀더. `publicId`는 제목 기반 슬러그 + 충돌 시 `-2`, `-3`… `sortOrder`는 현재 최댓값+1. 응답 `{ ok, publicId }` |
| `PATCH` | `/api/admin/projects/[publicId]` | 스칼라(`title`, `summary`, `readmeUrl`, `deployUrl`, `thumbnailUrl`) 및/또는 `kindTags`(Prisma `ProjectKindTag` 문자열 배열), `techTags`(문자열 배열, 항목당 최대 120자·최대 40개). 트랜잭션으로 본문 갱신 + 태그/기술 행 전체 교체 |
| `DELETE` | `/api/admin/projects/[publicId]` | 해당 `publicId` 행 삭제 |
| `PATCH` | `/api/admin/projects/reorder` | 본문 `{ orderedPublicIds: string[] }` — DB에 존재하는 **전체** `publicId`를 **한 번씩** 나열. `sortOrder`를 인덱스 `0 … n-1`로 일괄 갱신 |

---

## 클라이언트: `ProjectsSectionClient`

`components/sections/ProjectsSection.tsx`(서버)가 프로젝트 배열·`persistedPublicIds`·`adminEditable`을 넘기고, 실제 목록·상태는 **`ProjectsSectionClient`**(`"use client"`)에서 처리합니다.

### 새 프로젝트

1. 모바일/데스크톱 **유령 카드**(`AdminNewProjectGhost*`)로 `POST /api/admin/projects` 호출  
2. 응답 `publicId`를 `ephemeralNewIds`에 넣고 `autoEditPublicId`로 **같은 수정 UI**(`ProjectCardAdmin` / `AdminProjectCardToolbar`)를 자동 편집 모드로 연다  
3. **취소** 시 스텁은 `DELETE`로 제거. 카드는 **낙관적으로 즉시 숨김**(`hiddenProjectIds`) 후 요청, 실패 시 다시 표시  

### 저장 후 카드 갱신 (낙관적)

- PATCH 성공 직후 폼 값으로 만든 `Project` 스냅샷을 `optimisticById[publicId]`에 저장해 **refresh를 기다리지 않고** 보기 모드에 반영  
- 서버 `projects`와 내용이 같아지면(필드·칩·기술 태그를 정렬 후 비교) 오버레이 제거  
- 저장 버튼: 요청 중 **「저장 중…」**, 완료 후 편집 종료 + `router.refresh()`  

### 순서 변경 (드래그 앤 드롭)

- **조건**: `adminEditable`이고, 화면에 보이는 **persisted** 프로젝트가 **2개 이상**  
- **`@dnd-kit/core`**, **`@dnd-kit/sortable`**, **`@dnd-kit/utilities`** — 그리드에 `rectSortingStrategy`  
- 각 카드는 `ProjectsSectionSortableItem`(`useSortable`) + **`ProjectDragGrip`**(왼쪽 상단 2×3 점). **그립에만** `listeners`/`attributes`를 붙여 의도치 않은 드래그를 줄임  
- `PointerSensor` `activationConstraint.distance: 6`  
- 드롭 후 `localVisibleOrder`로 즉시 순서 반영, `PATCH /api/admin/projects/reorder`에 **보이는 순서 + 숨긴 카드 publicId(원본 `projects` 순서 유지)** 를 이어 붙인 전체 배열 전송  
- 실패 시 `localVisibleOrder` 초기화 후 `alert`  

### 편집 UI (`AdminProjectCardToolbar` 등)

- 제목·요약·README URL·배포 URL·썸네일(Firebase `uploadProjectThumbnail`, 경로 `portfolio/projects/{publicId}/…`)  
- 유형 칩: `lib/project-kind-tags.ts` — `TEAM` / `PERSONAL` / `IN_PROGRESS` ↔ 표시 라벨  
- 기술 태그: 인풋·추가·칩 삭제  
- 편집 중에는 하단 기술 칩·README/LIVE 영역 숨김(폼의 기술 블록만 사용)  

---

## 관련 파일 (주요)

```
lib/projects-db.ts                    # 홈용 프로젝트 로드·매핑
lib/project-kind-tags.ts             # 유형 태그 값·라벨 변환
app/api/admin/projects/route.ts      # POST 생성
app/api/admin/projects/[publicId]/route.ts  # PATCH / DELETE
app/api/admin/projects/reorder/route.ts     # PATCH sortOrder
components/sections/ProjectsSection.tsx     # 서버 래퍼
components/sections/ProjectsSectionClient.tsx
components/sections/ProjectsSectionSortableItem.tsx
components/projects/ProjectCard.tsx
components/projects/ProjectCardAdmin.tsx
components/projects/ProjectCardBodyAdmin.tsx
components/projects/AdminProjectCardToolbar.tsx
components/projects/AdminNewProjectGhost.tsx
components/projects/ProjectDragGrip.tsx
lib/firebase/uploadProjectThumbnail.ts
```

---

## UI·제한 사항 참고

- 카드 상단 배지는 `project-card-shared.tsx`의 `MAX_BADGES`(기본 2)로 잘릴 수 있음  
- DB가 비어 있다가 **첫 `POST`로만** 채우면, `getProjectsForHome()` 분기상 목록이 **mock 대신 DB만** 보일 수 있음  

---

## 관련 문서

- [admin.md](./admin.md) — 관리자 인증·대시보드  
- [admin-certs-ui.md](./admin-certs-ui.md) — 수료 및 자격 섹션 DB·순서(DnD)  
- [cms-prisma-design.md](./cms-prisma-design.md) — `Project` 모델·관계  
- [firebase-admin.md](./firebase-admin.md) — Storage 업로드·Auth  
