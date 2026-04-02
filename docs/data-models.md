# Mock 데이터·타입 구조

DB 연결 전까지 `data/*.ts`에 타입과 상수를 둡니다.

## `data/skillCategories.ts`

스킬 섹션 4카드용.

```ts
export type SkillCategory = {
  id: string;
  title: string;
  description: string;
};

export const skillCategories: SkillCategory[];
```

## `data/skills.ts`

향후 상세 스킬 목록(태그·아이콘 등)용으로 예약. 현재 빈 배열 유지 가능.

```ts
export type Skill = { id: string; name: string };
export const skills: Skill[];
```

## `data/projects.ts`

프로젝트 카드 3건 mock. `liveUrl`이 없으면 UI에서 LIVE 버튼을 숨김.

```ts
export type Project = {
  id: string;
  title: string;
  summary: string;
  statusChips: string[];
  image: string | null;
  techTags: string[];
  readmeUrl: string;
  liveUrl?: string;
};

export const projects: Project[];
```

## `data/certs.ts`

수료·자격 카드 mock. `url`이 있으면 카드 전체가 외부 링크(`target="_blank"`). 없으면 점선 테두리·비클릭 스타일이며 하단에 `공개 링크 없음` 표시.

```ts
export type Cert = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  url: string | null;
  hasPublicLink: boolean;
};

export const certs: Cert[];
```

## `data/guestbook.ts`

```ts
export type AuthorType = "admin" | "guest";
export type GuestbookBubbleColor =
  | "lavender"
  | "mint"
  | "peach"
  | "sky"
  | "rose";

export type GuestbookEntry = {
  id: string;
  authorType: AuthorType;
  nickname: string;
  message: string;
  bubbleColor: GuestbookBubbleColor | null; // admin 은 null
  createdAt: string; // ISO 8601
};

export const guestBubblePalette: { id; label; bubbleClass; swatchClass }[];
export const adminBubbleClass: string;
export function getGuestBubbleClass(color): string;
export const guestbookEntries: GuestbookEntry[];
```

스키마·카피 변경 시 [guestbook.md](./guestbook.md)와 UI를 함께 수정합니다.

## `data/githubContributions.ts`

About GitHub 기여 카드용 **타입만** 정의합니다. 실제 API 호출·가공은 `lib/github/fetchContributionSummary.ts`에서 수행합니다.

```ts
export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionSummary = {
  thisYear: number;
  today: number;
  days: ContributionDay[];
};
```

상세 흐름·환경 변수는 [github-contributions.md](./github-contributions.md)를 참고합니다.

## `data/contact.ts`

푸터 연락처 mock(이메일·GitHub·Velog·Instagram).

```ts
export const contact: {
  email: string;
  emailHref: string;
  github: { href: string; label: string };
  velog: { href: string; label: string };
  instagram: { href: string; label: string };
};
```
