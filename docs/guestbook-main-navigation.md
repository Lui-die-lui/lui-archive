# 방명록 → 메인 섹션 이동(인트로 로딩 스킵·앵커 스크롤)

방명록 페이지(`/guestbook`)에서 상단 내비게이션으로 메인(`/`)의 특정 섹션(`/#about` 등)으로 갈 때, **메인 홈의 인트로 최소 대기(약 800ms)** 때문에 `app/loading.tsx`가 잠깐 보이거나, **앵커만으로는 스크롤이 맞지 않아 히어로만 보이는 것처럼 느껴지는** 문제를 피하기 위한 구현 방식을 정리합니다.

---

## 문제가 된 배경

1. **메인 홈 `app/page.tsx`**  
   첫 진입 체감을 위해 `async` 함수 안에서 `setTimeout`으로 **최소 로딩 시간**을 두고 있습니다. 이 시간 동안 App Router가 **`app/loading.tsx`**를 보여줄 수 있습니다.

2. **방명록에서 메뉴 클릭 = 라우트 전환**  
   `/#about` 같은 링크는 결국 **`/`로 이동**합니다. 이때도 위 지연이 그대로 적용되면 “방명록에서 섹션만 바꾸는 것 같은 UX”가 아니라 **다시 인트로 로딩이 도는 것처럼** 보일 수 있습니다.

3. **쿠키만으로 스킵을 알리려다 실패할 수 있는 이유**  
   Next.js `Link`는 **프리패치·클라이언트 전환**을 사용합니다. 클릭 직전에 `document.cookie`로 “스킵” 플래그를 심어도, **이미 프리패치된 RSC 페이로드**나 전환 타이밍 때문에 **서버 요청에 쿠키가 반영되지 않는** 경우가 있습니다. 그래서 “스킵했는데도 로딩이 남는” 현상이 남을 수 있습니다.

4. **해시(`#about`)만으로는 스크롤이 어긋날 수 있는 이유**  
   섹션 일부는 **클라이언트에서 늦게 그려지거나**(예: 비동기 데이터·Reveal 등), **고정 헤더** 때문에 브라우저 기본 앵커 스크롤만으로는 **원하는 위치가 가려진 것처럼** 보일 수 있습니다.

---

## 채택한 해결 방식(요약)

| 단계 | 무엇을 하는가 |
|------|----------------|
| A | 방명록에서만, 메인 앵커 링크 클릭 시 **`/?skipIntro=1#섹션id`** 로 **`router.push(..., { scroll: false })`** (풀 리로드 대신 클라이언트 전환·상단 스크롤 리셋 방지) |
| B | `app/page.tsx`에서 **`searchParams.skipIntro === "1"`이면** 최소 대기 **생략** |
| C | 메인에 **`ScrollToHash`** — **`useLayoutEffect`**에서 `#id`로 **`scrollIntoView({ behavior: "instant" })`** 보정. 헤더 오프셋은 **`globals.css`의 `scroll-padding-top`** |

A는 쿠키보다 **요청 URL에 스킵 의도가 직접 실리기** 때문에 서버가 확실히 읽을 수 있습니다. C는 해시 스크롤이 한 번에 안 맞는 경우를 **보험**으로 잡으며, 전환 직후 흔들림은 [troubleshooting-guestbook-scroll.md](./troubleshooting-guestbook-scroll.md) 참고.

---

## 트러블슈팅

해시 이동 시 화면이 흔들리는 문제는 [troubleshooting-guestbook-scroll.md](./troubleshooting-guestbook-scroll.md)를 참고하세요.

## 관련 파일

| 파일 | 역할 |
|------|------|
| `components/layout/SkipIntroLoadingLink.tsx` | `/guestbook` + `href`가 `/#…`일 때 `preventDefault` 후 `router.push('/?skipIntro=1#…', { scroll: false })`. 방명록에서는 `prefetch={false}` |
| `app/page.tsx` | `searchParams.skipIntro`로 인트로 지연 스킵 여부 결정 |
| `components/ui/ScrollToHash.tsx` | `useLayoutEffect` + `scrollIntoView({ behavior: "instant" })`로 해시 보정 |
| `app/globals.css` | `html`의 `scroll-behavior: smooth`, `scroll-padding-top`(고정 헤더) — 메인 내 앵커 클릭용 |
| `components/layout/SiteHeader.tsx` | 로고·섹션 링크에 `SkipIntroLoadingLink` 사용 |
| `components/layout/MobileNavMenu.tsx` | 모바일 섹션 링크에 동일 컴포넌트 사용 |

---

## 동작 흐름(사용자 관점)

1. 사용자가 `/guestbook`에 있음.
2. 헤더에서 `about` 등을 누름 → 실제 이동 URL은 예: `/?skipIntro=1#about` (`router.push`, `scroll: false`).
3. 메인이 전환될 때 서버 컴포넌트가 `skipIntro=1`을 보고 **800ms 대기를 하지 않음**.
4. 클라이언트에서 `ScrollToHash`가 `#about` 요소를 찾아 **레이아웃 직후** 위치를 맞춤(`instant` + `scroll-padding-top`).

---

## 주의·한계

- **URL에 `?skipIntro=1`이 잠깐 남습니다.** 북마크·공유 시 의미 없는 쿼리가 포함될 수 있어, 필요하면 이후 `history.replaceState`로 쿼리만 지우는 개선을 검토할 수 있습니다.
- **헤더 아래 앵커 정렬**은 `globals.css`의 `--scroll-padding-top` / `scroll-padding-top`과 맞춥니다. 헤더 높이를 바꾸면 여기를 조정합니다.
- 메인 첫 방문(직접 `/` 입력 등)에서는 `skipIntro`가 없으므로 **기존처럼** 최소 대기가 적용됩니다.

---

## 관련 문서

- [troubleshooting-guestbook-scroll.md](./troubleshooting-guestbook-scroll.md) — 전환 시 화면 흔들림 트러블슈팅
- [guestbook.md](./guestbook.md) — 방명록 페이지·패널 전반 규칙
- [page-structure.md](./page-structure.md) — 섹션 앵커 `id` 목록
