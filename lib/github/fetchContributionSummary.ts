import type {
  ContributionDay,
  ContributionSummary,
} from "@/data/githubContributions";
import { unstable_noStore as noStore } from "next/cache";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/**
 * 달력만 요청(짧은 from~to). `contributionLevel` 미사용 → count로 0~4 산출.
 */
const CONTRIBUTIONS_QUERY = `
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
`;

/** 달력 구간 내 count 분포로 와이어프레임용 0~4 레벨 (원본 잔디 색상 복제 아님) */
function levelsFromCounts(
  days: { date: string; count: number }[],
): ContributionDay[] {
  const counts = days.map((d) => d.count);
  const positive = counts.filter((c) => c > 0);
  if (positive.length === 0) {
    return days.map((d) => ({ ...d, level: 0 as const }));
  }
  const sorted = [...positive].sort((a, b) => a - b);
  const q = (p: number) => {
    if (sorted.length === 0) return 0;
    const idx = Math.min(
      sorted.length - 1,
      Math.floor((sorted.length - 1) * p),
    );
    return sorted[idx] ?? 0;
  };
  const t1 = q(0.25);
  const t2 = q(0.5);
  const t3 = q(0.75);

  const toLevel = (count: number): ContributionDay["level"] => {
    if (count <= 0) return 0;
    if (count <= t1) return 1;
    if (count <= t2) return 2;
    if (count <= t3) return 3;
    return 4;
  };

  return days.map((d) => ({
    date: d.date,
    count: d.count,
    level: toLevel(d.count),
  }));
}

/** contributionCalendar의 `date`와 맞출 오늘·연도 (Asia/Seoul 달력) */
function seoulCalendarDate(): { todayStr: string; year: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  const todayStr = `${y}-${m}-${d}`;
  return { todayStr, year: y };
}

/** `.env`에서 따옴표로 감싼 값·CRLF 잔여 제거 */
function sanitizeEnv(v: string | undefined): string {
  if (v == null) return "";
  let s = v.trim().replace(/\r$/, "");
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function calendarFromBoundaries(to: Date): { fromCalendar: string; toIso: string } {
  const toIso = to.toISOString();

  const from370 = new Date(to);
  from370.setUTCDate(from370.getUTCDate() - 370);
  const yearStart = new Date(Date.UTC(to.getUTCFullYear(), 0, 1));
  const fromCalendar = new Date(
    Math.min(from370.getTime(), yearStart.getTime()),
  );

  return {
    fromCalendar: fromCalendar.toISOString(),
    toIso,
  };
}

export type ContributionSummaryResult = {
  summary: ContributionSummary | null;
  /** API 성공 시 `viewer.login`, 실패 시 `GITHUB_USERNAME` 폴백 */
  displayHandle: string;
};

/**
 * GitHub GraphQL(서버 전용). 토큰은 환경변수만 사용.
 * 실패·미설정 시 summary는 null, 페이지는 계속 렌더.
 */
export async function fetchContributionSummary(): Promise<ContributionSummaryResult> {
  noStore();

  const envLogin = sanitizeEnv(process.env.GITHUB_USERNAME);
  const token = sanitizeEnv(process.env.GITHUB_TOKEN);
  if (!token) {
    return { summary: null, displayHandle: envLogin };
  }

  const to = new Date();
  to.setUTCHours(23, 59, 59, 999);
  const { fromCalendar, toIso } = calendarFromBoundaries(to);

  const fetchOptions: RequestInit & { next?: { revalidate: number } } =
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" }
      : { next: { revalidate: 3600 } };

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: {
          fromCalendar,
          to: toIso,
        },
      }),
      ...fetchOptions,
    });

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        const body = await res.text().catch(() => "");
        console.error("[github contributions] HTTP", res.status, body);
      }
      return { summary: null, displayHandle: envLogin };
    }

    const json: {
      errors?: { message: string; extensions?: unknown }[];
      data?: {
        viewer: null | {
          login: string;
          calendarPart: null | {
            contributionCalendar: null | {
              weeks: {
                contributionDays: {
                  date: string;
                  contributionCount: number;
                }[];
              }[];
            };
          };
        };
      };
    } = await res.json();

    if (json.errors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[github contributions] GraphQL:",
          JSON.stringify(json.errors, null, 2),
        );
      }
      return { summary: null, displayHandle: envLogin };
    }

    const viewer = json.data?.viewer;
    if (!viewer?.login) {
      return { summary: null, displayHandle: envLogin };
    }

    const cal = viewer.calendarPart?.contributionCalendar;
    if (!cal) {
      return { summary: null, displayHandle: viewer.login };
    }

    const weeks = cal.weeks ?? [];

    const rawDays: { date: string; count: number }[] = [];
    for (const week of weeks) {
      for (const d of week.contributionDays) {
        rawDays.push({
          date: d.date,
          count: d.contributionCount,
        });
      }
    }
    rawDays.sort((a, b) => a.date.localeCompare(b.date));

    const days = levelsFromCounts(rawDays);

    const { todayStr, year } = seoulCalendarDate();
    const thisYear = days
      .filter((d) => d.date.startsWith(year))
      .reduce((s, d) => s + d.count, 0);
    const todayEntry = days.find((d) => d.date === todayStr);
    const today = todayEntry?.count ?? 0;

    return {
      summary: {
        thisYear,
        today,
        days,
      },
      displayHandle: viewer.login,
    };
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[github contributions]", e);
    }
    return { summary: null, displayHandle: envLogin };
  }
}
