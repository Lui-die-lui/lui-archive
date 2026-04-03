# 트러블슈팅: 방명록 → 메인 섹션(해시) 이동 시 화면 흔들림

## 증상

방명록(`/guestbook`)에서 네비의 섹션 링크(예: `/#about`)를 눌러 메인으로 돌아올 때, **최초에 화면이 잠깐 흔들리거나 위쪽이 보였다가 섹션으로 밀리는 느낌**이 난다.

## 원인 (요약)

1. **풀 페이지 리로드**  
   `window.location.assign('/?skipIntro=1#about')`처럼 이동하면 Next의 **`loading.tsx`** 가 잠깐 올라오고, 이후 본문이 그려지면서 레이아웃이 바뀐다.

2. **스크롤 보정 타이밍**  
   해시 위치를 맞추는 `ScrollToHash`가 **`useEffect` + `scroll-behavior: smooth`** 이면, 첫 페인트 이후에 스크롤이 걸려 **잠깐 상단(히어로)이 보인 뒤** 부드럽게 내려가는 것처럼 느껴진다.

3. **라우터의 스크롤 리셋**  
   클라이언트 전환 시에도 기본 동작으로 **맨 위로 스크롤**이 먹으면, 해시 스크롤과 순서가 겹칠 수 있다.

## 적용한 해결

### 1. `SkipIntroLoadingLink` — 방명록 → 메인만

- **`window.location.assign` 제거** → **`router.push(url, { scroll: false })`**
- 풀 리로드·로딩 UI 빈도를 줄이고, 전환 시 **상단으로 강제 스크롤**을 막아 해시 정렬과 충돌을 줄인다.
- `skipIntro=1` 쿼리는 기존과 동일하게 유지한다.

관련 파일: `components/layout/SkipIntroLoadingLink.tsx`

### 2. `ScrollToHash` — 로드·전환 직후 해시 맞춤

- **`useEffect` → `useLayoutEffect`**  
  DOM 반영 직후·브라우저 페인트 전에 실행되도록 해, “위가 잠깐 보임”을 줄인다.
- **`scrollIntoView({ behavior: "instant", block: "start" })`**  
  이 컴포넌트는 “첫 진입 시 위치 보정” 용도로만 쓰이므로 **즉시 이동**으로 둔다.  
  (같은 타이밍에 `smooth`를 쓰면 상단 플래시 + 애니메이션이 겹쳐 흔들림처럼 보이기 쉽다.)

관련 파일: `components/ui/ScrollToHash.tsx`

### 3. 메인 페이지 안에서의 부드러운 스크롤

- **`app/globals.css`** 의 **`html { scroll-behavior: smooth; scroll-padding-top: … }`** 는 그대로 둔다.
- **같은 문서**에서 `href="#skills"` 등으로 이동할 때의 자연스러운 스크롤은 여기서 처리한다.
- 방명록에서 돌아온 **첫 보정**은 `ScrollToHash`의 `instant`와 역할을 나눈다.

## 관련 문서·코드

- [guestbook-main-navigation.md](./guestbook-main-navigation.md) — 방명록 ↔ 메인, `skipIntro`·링크 동작
- `components/layout/SkipIntroLoadingLink.tsx`
- `components/ui/ScrollToHash.tsx`
- `app/globals.css` (`scroll-behavior`, `scroll-padding-top`)

## 나중에 다시 흔들리면 점검할 것

- `router.push`에 **`scroll: false`** 가 빠졌는지
- `ScrollToHash`가 다시 **`useEffect` + smooth** 로 바뀌지 않았는지
- 루트 `loading.tsx`가 특정 전환에서 과하게 길게 보이지 않는지
