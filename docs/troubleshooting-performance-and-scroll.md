# 트러블슈팅: 홈 LCP·CLS·Next.js 스크롤 경고

Lighthouse / Chrome Performance에서 **LCP 지연**, **CLS(Cumulative Layout Shift)** 가 나오거나, 개발자 콘솔에 **`scroll-behavior: smooth` 관련 Next.js 메시지**가 뜰 때의 원인과 적용한 개선을 정리합니다.

---

## 개선 요약

| 항목 | 문제 | 조치 |
|------|------|------|
| LCP | 메인 페이지가 서버에서 **고정 지연(약 800ms)** 후에야 RSC를 내려보내 초기 페인트가 늦어짐 | `app/page.tsx`에서 **인트로용 `setTimeout` 제거**, `searchParams.skipIntro` 분기 삭제 |
| LCP | 히어로 아래 **About·Skills·Projects·Certs**가 모두 async(DB/API)라 한꺼번에 기다리며 히어로 스트리밍이 뒤로 밀릴 수 있음 | 각 섹션을 **`Suspense`** 로 분리해 **히어로를 먼저** 스트리밍 |
| CLS | **`#projects` / `#skills`** 에서 `Suspense` **`fallback={null}`** 이면 높이 0→본문으로 급변 | **`ProjectsSectionSkeleton`**, **`SkillsSectionSkeleton`** 으로 헤더·카드 영역 높이 선점 |
| 라우트 전환·콘솔 | `html { scroll-behavior: smooth }`만 있으면 Next가 라우트 전환 시 스크롤을 제어하기 어렵고 **경고** 출력 | `app/layout.tsx`의 `<html>`에 **`data-scroll-behavior="smooth"`** 추가 |

---

## LCP가 나쁘게 나오던 배경

1. **`app/page.tsx`의 서버 대기**  
   첫 방문 시에도 `await new Promise(800ms)` 로 본문 전체가 지연되어, 실제 “큰 콘텐츠”가 히어로 제목이 아니라 **아래 섹션 텍스트**(예: Skills 카드의 `techStack` 문단)로 잡히는 등 LCP 수치가 악화될 수 있었음.

2. **async 섹션 묶음**  
   About(GitHub), Skills, Projects, Certs가 DB·외부 API를 기다리면, 스트리밍 경계 없이는 히어로와 같은 응답에 묶여 체감·지표 모두 불리해질 수 있음.

### 적용 후 기대

- 히어로(큰 타이틀·부제)가 **더 일찍** LCP 후보가 되기 쉬움.
- About·Certs는 `fallback={null}` (필요 시 동일 패턴으로 스켈레톤 추가 가능). **Projects·Skills** 는 스켈레톤 적용.

### 관련 코드·문서

- `app/page.tsx`, `ProjectsSectionSkeleton.tsx`, `SkillsSectionSkeleton.tsx`
- 방명록 내비·`skipIntro` 설명 갱신: [guestbook-main-navigation.md](./guestbook-main-navigation.md), [implementation.md](./implementation.md)

---

## CLS — `section#projects` · `section#skills` 에서 점수가 크게 나올 때

### 원인

메인 홈에서 `ProjectsSection`·`SkillsSection`이 **비동기**라 `Suspense` 경계 안에 있음. **`fallback`이 비어 있으면** 해당 구간은 처음에 높이가 거의 없다가, 데이터가 오면 **카드 그리드·캐러셀**이 한꺼번에 들어와 레이아웃이 크게 밀림. Lighthouse가 **`#projects`** 또는 **`#skills`** 를 최악 클러스터로 잡는 경우가 많음.

### 조치

- **`ProjectsSectionSkeleton`**: `ProjectsSection`과 동일 `id`·배경·헤더·3열 그리드, 썸네일 `aspect-[16/10]` + 본문·태그·푸터 자리. 모바일/데스크톱 카드 **최소 높이**를 본문에 가깝게 조정.
- **`SkillsSectionSkeleton`**: `SkillsSection`과 동일 `id`·배경·헤더. **모바일**은 캐러셀 1장(`min-h-[14.25rem]` 등) + 도트 줄, **md↑** 는 4행 단열 그리드 스켈레톤.
- `app/page.tsx`에서 각각 `<Suspense fallback={…}>` 로 연결.

스켈레톤과 실제 콘텐츠 높이가 완전히 같지 않으면 **소폭** CLS는 남을 수 있음. 프로젝트 카드 이미지는 `aspect-ratio` 로 추가 완화.

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
