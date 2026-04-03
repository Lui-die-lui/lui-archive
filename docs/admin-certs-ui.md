# Certs 섹션 — DB 로드·편집·추가·순서(DnD)

홈 **수료 및 자격**(`/#certs`)은 Prisma `Certification` 행이 있으면 DB에서(`sortOrder` 오름차순), 없거나 오류 시 `data/certs.ts` 정적 목록을 씁니다.

---

## 데이터

| 구분 | 설명 |
|------|------|
| 서버 | `lib/certs-db.ts`의 `getCertsForHome()` |
| 매핑 | `issuedAtLabel` → `Cert.issuedAt`, `CertAvatarVariant` → 소문자 `han` / `google` / `anthropic` |
| 정렬 | `Certification.sortOrder` |
| 날짜 UI | 월·년 선택 → `lib/cert-issued-label.ts`의 `formatIssuedAtLabel`로 `Jan 2026` 형태 저장 |

`persistedCertIds`: DB 행의 `id`(cuid). 정적 mock만 쓸 때는 비어 있어 **관리자 편집·DnD·유령 추가**는 동작하지 않음(첫 `POST`로 DB에 넣으면 이후 활성).

---

## API (관리자 쿠키)

| 메서드 | 경로 | 역할 |
|--------|------|------|
| `POST` | `/api/admin/certs` | 자격증 생성. 기본 제목 `새 자격증` 등. 응답 `{ ok, id }` |
| `PATCH` | `/api/admin/certs/[id]` | `title`, `issuer`, `issuedAtLabel`, `url`, `hasPublicLink`, `avatarText`, `avatarVariant`(han/google/anthropic) |
| `DELETE` | `/api/admin/certs/[id]` | 삭제 |
| `PATCH` | `/api/admin/certs/reorder` | `{ orderedIds }` — DB **전체** `id` 한 번씩, `sortOrder` 0…n-1 |

---

## UI 흐름 (관리자)

1. 섹션 **부제(설명 문단)와 카드 그리드 사이** · **우측**에 가로로 넓은 알약형 버튼 **「수정」** — 클릭 시 **일괄 편집 모드**, 버튼 문구는 **「완료」**로 바뀜. (`SectionIntroHeader` 제목 옆 액션은 사용하지 않음.) **관리자만** 헤더 아래 **`mt-6`**·알약 행–그리드 **`gap-3`** (촘촘한 편집 UI). **게스트(비로그인)** 는 Projects·Skills와 같이 본문 래퍼 **`mt-12`** 만 적용해 이전과 동일한 여백.
2. 일괄 모드에서 각 DB 카드 **우측 상단**에 **`AiOutlineEdit` / `AiOutlineDelete`** (`react-icons/ai`) — **해당 카드를 편집 중**일 때는 그 카드에만 버튼 숨김.
3. **카드 수정**  
   - **모바일(뷰포트 768px 미만)**: 해당 카드 안에 인라인 폼(`CertEditForm` + 카드 톤 테두리).  
   - **데스크톱**: `AdminDismissibleModal` — 바깥(백드롭) 클릭·**Escape**로 닫힘. 스텁(새로 만든 행)을 닫으면 **DELETE**로 롤백.
4. 폼 필드: 이름, 발행원, **링크 (선택)**(비우면 DB `url` null·`hasPublicLink` false), 월·년. 카드 아바타는 **발행원 첫 글자**만 표시(API가 `avatarText`/`avatarVariant`를 발행원 기준으로 맞춤). 보기 모드에서만 링크가 없을 때 제목 옆 **「링크 없음」** 칩 — **일괄 편집 모드**에서는 `invisible`로 자리만 유지해 레이아웃이 덜컥거리지 않게 함. 스타일은 Projects 편집 폼과 같은 `fieldBox` / 라벨 톤.
5. **유령 추가**: Projects와 동일 패턴 — 모바일 가로형·데스크톱 그리드 셀형 `AdminNewCertGhost*`, `POST` 후 자동으로 편집 UI 오픈.
6. **DnD**: 그립은 왼쪽 위(기존). **카드 편집 모달/인라인이 열리면** `useSortable({ disabled })`로만 드래그·그립을 끄고, `DndContext`/`SortableItem` 래퍼는 유지해 레이아웃이 흔들리지 않게 함.

---

## 관련 파일

```
lib/certs-db.ts
lib/cert-issued-label.ts
app/api/admin/certs/route.ts
app/api/admin/certs/[id]/route.ts
app/api/admin/certs/reorder/route.ts
components/sections/CertsSection.tsx
components/sections/CertsSectionClient.tsx
components/sections/CertsSectionSortableItem.tsx
components/certs/CertCard.tsx
components/certs/CertEditForm.tsx
components/certs/AdminNewCertGhost.tsx
components/ui/SectionIntroHeader.tsx   # titleAction
components/ui/AdminDismissibleModal.tsx
components/projects/ProjectDragGrip.tsx
```

---

## 관련 문서

- [admin-projects-ui.md](./admin-projects-ui.md) — Projects CMS·유령 버튼·DnD 패턴
- [admin.md](./admin.md)
- [cms-prisma-design.md](./cms-prisma-design.md)
