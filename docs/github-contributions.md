# GitHub 기여 데이터 (About 카드)

About 섹션의 작은 GitHub contribution 카드는 **GitHub GraphQL API**로만 데이터를 가져오며, **토큰은 서버에서만** 사용합니다.

---

## GraphQL·GitHub 연동이 처음이라면

### GraphQL이 REST와 다른 점(아주 짧게)

- **REST**: URL마다 자원이 정해져 있고, 여러 정보가 필요하면 요청을 여러 번 보내는 경우가 많습니다.
- **GraphQL**: **한 번의 POST 요청**에 **문자열로 된 질의(query)**와 **변수(variables)**를 보내고, 질의에 적어 둔 **필드만** JSON 형태로 돌려받습니다. “필요한 모양만 골라 달라”고 적는 쿼리 언어에 가깝습니다.

공식 개요: [About the GitHub GraphQL API](https://docs.github.com/en/graphql/guides/introduction-to-graphql)

### GitHub GraphQL을 쓰려면

1. **엔드포인트는 하나**입니다.  
   `https://api.github.com/graphql`  
   브라우저로 여는 API가 아니라, **항상 `POST`**로 호출합니다.

2. **인증**은 HTTP 헤더에 **개인 액세스 토큰(PAT)** 을 넣습니다.  
   `Authorization: Bearer <GITHUB_TOKEN>`  
   토큰 없이면 공개 데이터만 되고, **기여 달력처럼 본인 정보는 거의 안 됩니다.**

3. **요청 본문**은 JSON 한 덩어리입니다.

```json
{
  "query": "query 이름이나 인라인 쿼리 문자열…",
  "variables": { "이름": "값" }
}
```

- **`query`**: GraphQL 문법으로 “어떤 타입의 어떤 필드를 달라”고 적습니다.
- **`variables`**: 쿼리 안의 `$fromCalendar`, `$to` 같은 **매개변수**에 실제 날짜 문자열을 넣습니다. 문자열을 쿼리에 직접 이어 붙이지 않아서 **안전하고 읽기 쉽습니다.**

4. **응답**도 JSON입니다.

   - 성공 시 보통 **`data`** 안에 질의한 필드가 들어옵니다.
   - 문제가 있으면 **`errors`** 배열에 메시지가 들어옵니다. HTTP는 200인데 `errors`만 있는 경우도 있어서, **반드시 `errors`를 확인**하는 편이 좋습니다.

### 이 프로젝트에서 하는 일(한 줄 요약)

Next.js **서버**(서버 컴포넌트가 돌아가는 Node 환경)에서 `fetch`로 위 엔드포인트에 POST하고, 돌아온 `contributionCalendar`를 우리가 쓰기 좋은 **`ContributionSummary`** 형태로 바꾼 뒤, About의 카드 컴포넌트에 **프롭으로만** 넘깁니다. **토큰은 `.env` → `process.env` → 서버에서만** 쓰이고, 브라우저로 내려가지 않습니다.

### 우리가 보내는 질의(개념)

실제 문자열은 `lib/github/fetchContributionSummary.ts`의 `CONTRIBUTIONS_QUERY`에 있습니다. 구조만 보면 다음과 같습니다.

```graphql
query ViewerContributions($fromCalendar: DateTime!, $to: DateTime!) {
  viewer {
    login
    calendarPart: contributionsCollection(from: $fromCalendar, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
```

- **`viewer`**: “지금 이 토큰으로 로그인한 사용자”입니다. 그래서 **`GITHUB_USERNAME`과 토큰 주인이 다르면** 예전에 문제가 생기기도 했고, 지금은 **무조건 토큰 주인의 기여**만 가져옵니다.
- **`contributionsCollection(from, to)`**: 그 사용자의 **해당 기간 기여 모음**입니다. GitHub 스키마에서 정해진 타입입니다.
- **`calendarPart:`** 는 **별칭(alias)** 입니다. 같은 타입을 두 번 다른 인자로 받을 때 쓰던 패턴을 단순화한 뒤, 지금은 **달력 한 번만** 요청합니다.
- **`weeks` → `contributionDays`**: 주 단위로 묶인 **날짜별 커밋 수**입니다. 여기서 `date`, `contributionCount`만 받아서, 카드의 **This year / Today / 작은 블록**을 계산합니다.

### 데이터가 화면까지 가는 순서

1. 사용자가 About이 있는 페이지를 요청합니다.
2. `AboutSection`(서버 컴포넌트)이 `fetchContributionSummary()`를 호출합니다.
3. 그 함수가 GitHub GraphQL에 POST → JSON 파싱 → `thisYear`, `today`, `days` 등으로 가공합니다.
4. 같은 서버에서 `GithubContributionCard`를 HTML로 렌더할 때 그 값을 넣습니다.
5. 브라우저에는 **이미 계산된 숫자·블록**만 보이고, **토큰은 절대 포함되지 않습니다.**

### 토큰 만들 때 참고

- GitHub → **Settings → Developer settings** → Personal access tokens에서 **Classic** 또는 **Fine-grained** 발급.
- Classic이면 **`read:user`** 정도로 프로필·관련 메타 읽기가 가능한지 확인.
- Fine-grained면 **Account permissions → User** 에서 읽기 권한이 기여/프로필 조회에 필요한지 문서와 맞춰 설정.
- 토큰은 **레포에 커밋하지 말고** `.env`에만 두고, 예시는 `.env.example`처럼 **빈 값**만 올립니다.

---

## 환경 변수

| 변수 | 용도 |
|------|------|
| `GITHUB_USERNAME` | (선택) 실패 시 카드 `@핸들` 폴백·로컬 표기용. 데이터는 **`viewer`(토큰 주인)** 기준으로만 가져옴 |
| `GITHUB_TOKEN` | `Authorization: Bearer`. **Classic**은 `read:user` 권한 권장. **Fine-grained**는 Account → **User** 읽기(프로필·기여 조회)가 켜져 있어야 함 |

클라이언트 번들에 노출되지 않도록 **`NEXT_PUBLIC_` 접두사를 붙이지 않습니다.**

## 파일 역할

| 파일 | 역할 |
|------|------|
| `data/githubContributions.ts` | `ContributionDay`, `ContributionSummary` 타입 정의 |
| `lib/github/fetchContributionSummary.ts` | GraphQL 요청·응답 파싱·`ContributionSummary` 가공 (서버 전용 import 경로) |
| `components/about/GithubContributionCard.tsx` | 요약 데이터·핸들을 받아 소형 카드 UI (블록 미리보기 + **This year**(강조) / Today) |
| `components/sections/AboutSection.tsx` | 서버에서 `fetchContributionSummary()` 호출 후 카드에 전달 |

## GraphQL에서 사용하는 필드

- **`viewer`** — 토큰에 매칭된 계정만 조회 가능.
- `calendarPart: contributionsCollection(from, to)` 한 번만 사용. `from`은 **올해 1/1과 (오늘−370일) 중 더 이른 시점**, `to`는 요청 시점 UTC 당일 끝(달력·thisYear·today·블록에 필요한 구간).
- `contributionDays`: `date`, `contributionCount`만 사용. **레벨 0~4**는 구간 내 count 사분위로 클라이언트에서 산출.

## 가공 결과 (`ContributionSummary`)

```ts
type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 달력 구간 내 count 사분위로 산출
};

type ContributionSummary = {
  thisYear: number;   // 달력 일자 중 당해연도 count 합
  today: number;      // 오늘(Asia/Seoul YYYY-MM-DD) 해당 일자의 count
  days: ContributionDay[];
};
```

- **today**: `days`에서 `date === 오늘(Asia/Seoul 기준 YYYY-MM-DD)`인 항목의 `count`, 없으면 `0`.
- **thisYear**: 위와 같은 기준의 **연도**로 `date`가 해당 연도인 날의 `count` 합.
- **블록 미리보기**: 최근 35일의 `level`을 5×7 그리드로 배치(부족 시 레벨 0 패딩). UI는 연한 스카이 톤으로만 표시.

## 실패 시 동작

토큰 없음·HTTP/GraphQL 오류·`viewer` 없음 등은 **`summary: null`**로 처리하고, 카드는 `—`·빈 블록 그리드로 표시해 **페이지가 깨지지 않게** 합니다. 개발 모드(`NODE_ENV=development`)에서는 터미널에 `[github contributions]` 로그가 남을 수 있습니다.

## 캐시·반영이 안 될 때

- `unstable_noStore()`로 RSC 정적 캐시를 끄고, **개발**에서는 `fetch`에 `cache: 'no-store'`를 써서 새로고침마다 다시 호출합니다.
- **프로덕션**에서는 `fetch`에 `next: { revalidate: 3600 }`(약 1시간 ISR)을 사용합니다.
- `.env` 값의 **따옴표**는 서버에서 벗겨 씁니다.
