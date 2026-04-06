# 트러블슈팅: 홈 LCP·Next.js 스크롤 경고

Lighthouse / Chrome Performance에서 **LCP(Largest Contentful Paint) 지연**이 나오거나, 개발자 콘솔에 **`scroll-behavior: smooth` 관련 Next.js 메시지**가 뜰 때의 원인과 적용한 개선을 정리합니다.

---

## 개선 요약

| 항목 | 문제 | 조치 |
|------|------|------|
| LCP | 메인 페이지가 서버에서 **고정 지연(약 800ms)** 후에야 RSC를 내려보내 초기 페인트가 늦어짐 | `app/page.tsx`에서 **인트로용 `setTimeout` 제거**, `searchParams.skipIntro` 분기 삭제 |
| LCP | 히어로 아래 **About·Skills·Projects·Certs**가 모두 async(DB/API)라 한꺼번에 기다리며 히어로 스트리밍이 뒤로 밀릴 수 있음 | 각 섹션을 **`<Suspense fallback={null}>`** 로 분리해 **히어로를 먼저** 스트리밍 |
| 라우트 전환·콘솔 | `html { scroll-behavior: smooth }`만 있으면 Next가 라우트 전환 시 스크롤을 제어하기 어렵고 **경고** 출력 | `app/layout.tsx`의 `<html>`에 **`data-scroll-behavior="smooth"`** 추가 |

---

## LCP가 나쁘게 나오던 배경

1. **`app/page.tsx`의 서버 대기**  
   첫 방문 시에도 `await new Promise(800ms)` 로 본문 전체가 지연되어, 실제 “큰 콘텐츠”가 히어로 제목이 아니라 **아래 섹션 텍스트**(예: Skills 카드의 `techStack` 문단)로 잡히는 등 LCP 수치가 악화될 수 있었음.

2. **async 섹션 묶음**  
   About(GitHub), Skills, Projects, Certs가 DB·외부 API를 기다리면, 스트리밍 경계 없이는 히어로와 같은 응답에 묶여 체감·지표 모두 불리해질 수 있음.

### 적용 후 기대

- 히어로(큰 타이틀·부제)가 **더 일찍** LCP 후보가 되기 쉬움.
- 섹션은 데이터 준비 후 순차 등장(`fallback={null}` 이라 빈 구간은 짧게 비어 보일 수 있음).

### 관련 코드·문서

- `app/page.tsx`
- 방명록 내비·`skipIntro` 설명 갱신: [guestbook-main-navigation.md](./guestbook-main-navigation.md), [implementation.md](./implementation.md)

---

## `missing-data-scroll-behavior` 콘솔 메시지

### 증상

개발자 도구에 다음과 유사한 안내가 표시됨.

- `Detected scroll-behavior: smooth on the <html> element`
- `add data-scroll-behavior="smooth" to your <html> element`
- 링크: [Next.js — missing-data-scroll-behavior](https://nextjs.org/docs/messages/missing-data-scroll-behavior)

### 원인

`globals.css`의 `html { scroll-behavior: smooth; }`는 앵커 이동 UX에 도움이 되지만, **클라이언트 라우트 전환** 시에도 smooth가 적용되면 스크롤 위치 복원이 어색할 수 있음. Next.js는 전환 중 smooth를 끄고 싶은데, 그 전에 **“smooth는 의도한 설정”**임을 `data` 속성으로 알려 달라는 것.

### 조치

`app/layout.tsx`:

```tsx
<html lang="ko" data-scroll-behavior="smooth" ...>
```

이후 동일 경고는 나오지 않아야 하며, 앵커 스크롤은 기존과 같이 smooth를 유지하는 방향으로 동작함.

---

## 관련 문서

- [troubleshooting-prisma-supabase-pooler.md](./troubleshooting-prisma-supabase-pooler.md) — 배포 DB·Prisma 풀러
- [troubleshooting-guestbook-scroll.md](./troubleshooting-guestbook-scroll.md) — 해시 이동 시 화면 흔들림
- [guestbook-main-navigation.md](./guestbook-main-navigation.md) — `?skipIntro=1`·`ScrollToHash`
