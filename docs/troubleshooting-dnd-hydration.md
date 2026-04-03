# 트러블슈팅: DnD 그립(ProjectDragGrip) 하이드레이션 경고

## 증상

개발 콘솔에 다음과 유사한 React 경고가 뜹니다.

- `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties`
- 스택이 `ProjectDragGrip.tsx`의 `<button>`(또는 `useSortable` + `attributes`를 붙인 요소)을 가리킴

## 원인

`@dnd-kit/core`의 `DndContext`는 접근성용으로 각 드래그 핸들에 `aria-describedby` 등을 붙입니다. 이때 내부에서 `@dnd-kit/utilities`의 `useUniqueId(prefix, value)`를 쓰는데, **`value`(고정 id)를 넘기지 않으면** 모듈 전역 객체 `ids`로 카운터를 올려 `DndDescribedBy-0`, `DndDescribedBy-1` … 형태의 문자열을 만듭니다.

Next.js **서버**는 한 Node 프로세스에서 여러 요청을 처리하면서 그 모듈 상태가 **요청 간에 누적**될 수 있습니다. 반면 **브라우저**는 페이지마다 JS를 새로 로드해 카운터가 0부터 다시 시작합니다. 그 결과 SSR로 나간 HTML의 `aria-describedby`(및 이와 연동된 속성)와 클라이언트 첫 렌더가 어긋나 **하이드레이션 불일치**가 납니다.

드래그 그립은 `ProjectsSectionSortableItem` / `CertsSectionSortableItem`에서 `useSortable`의 `attributes`·`listeners`를 `ProjectDragGrip`에 넘기므로, 경고 위치가 그 버튼으로 표시되는 경우가 많습니다.

## 이 프로젝트에서 한 조치

각 `DndContext`에 **페이지 안에서 유일한 고정 문자열**을 `id` prop으로 넘깁니다. 이렇게 하면 `useUniqueId("DndDescribedBy", id)`가 카운터 대신 그 문자열을 그대로 써서 SSR·CSR이 동일해집니다.

- Projects: `id="portfolio-projects-dnd"` (`ProjectsSectionClient.tsx`)
- Certs: `id="portfolio-certs-dnd"` (`CertsSectionClient.tsx`)

같은 화면에 `DndContext`가 둘 이상 있으면 서로 다른 `id`를 써야 합니다.

## 그래도 의심될 때 점검할 것

1. **브라우저 확장 프로그램**이 DOM을 바꾸는 경우(React 메시지에도 나옴) — 시크릿 창·확장 비활성화로 재현 여부 확인.
2. **`typeof window` / `Date.now()` / `Math.random()`** 등으로 초기 렌더만 다른 속성을 주는 컴포넌트가 같은 트리에 있는지.
3. `@dnd-kit` 업그레이드 후 동일 증상이면, 릴리스 노트·이슈에서 SSR 관련 변경 여부 확인.
4. 여전히 DnD 쪽만 문제라면, **마운트 후에만** `DndContext`를 렌더하는 패턴(깜빡임·레이아웃 비용 있음)을 최후 수단으로 고려.

## 관련 파일

- `components/projects/ProjectDragGrip.tsx`
- `components/sections/ProjectsSectionSortableItem.tsx`, `CertsSectionSortableItem.tsx`
- `components/sections/ProjectsSectionClient.tsx`, `CertsSectionClient.tsx`
