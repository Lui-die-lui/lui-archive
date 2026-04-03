import { GuestbookAuthorType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

/** 대시보드 추이·최근 N일 집계에 사용 */
const DASHBOARD_TZ = "Asia/Seoul";

function ymdKeyInTimeZone(d: Date, timeZone: string): string {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = f.formatToParts(d);
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${day}`;
}

function ymdKeySeoul(d: Date): string {
  return ymdKeyInTimeZone(d, DASHBOARD_TZ);
}

/** YYYY-MM-DD(서울 달력)에 대해 그날 12:00 KST를 기준으로 일수를 더해 새 서울 날짜 키 반환 */
function addCalendarDaysSeoul(ymd: string, delta: number): string {
  const d = new Date(`${ymd}T12:00:00+09:00`);
  d.setTime(d.getTime() + delta * DAY_MS);
  return ymdKeySeoul(d);
}

/** 오늘(서울) 포함 연속 n일, YYYY-MM-DD 오름차순(가장 오래된 날 → 오늘) */
function lastNDayKeysSeoul(n: number): string[] {
  const today = ymdKeySeoul(new Date());
  const out: string[] = [];
  for (let i = 0; i < n; i += 1) {
    out.push(addCalendarDaysSeoul(today, -(n - 1) + i));
  }
  return out;
}

/** 서울 해당 일 자정(KST)을 ISO 시각으로 */
function startOfSeoulYmd(ymd: string): Date {
  return new Date(`${ymd}T00:00:00+09:00`);
}

function bucketBySeoulDay(
  rows: { createdAt: Date }[],
  dayKeys: string[],
): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const k of dayKeys) map.set(k, 0);
  for (const { createdAt } of rows) {
    const k = ymdKeySeoul(createdAt);
    if (map.has(k)) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return dayKeys.map((day) => ({ day, count: map.get(day) ?? 0 }));
}

export type AdminDashboardPayload = {
  visitSeries: { day: string; count: number }[];
  guestbookSeries: { day: string; count: number }[];
  totals: {
    totalVisits: number;
    visitsLast7Days: number;
    totalGuestbookEntries: number;
    newGuestbook24h: number;
  };
  guestbookSubmissionsOpen: boolean;
};

const CHART_DAYS = 14;

export async function getAdminDashboardStats(): Promise<AdminDashboardPayload> {
  const dayKeys = lastNDayKeysSeoul(CHART_DAYS);
  const rangeStart = startOfSeoulYmd(dayKeys[0]);

  const now = new Date();
  const todaySeoul = ymdKeySeoul(now);
  const sevenDaysAgoSeoul = addCalendarDaysSeoul(todaySeoul, -7);
  const sevenDaysStart = startOfSeoulYmd(sevenDaysAgoSeoul);

  const dayAgo = new Date(now.getTime() - DAY_MS);

  const [
    visitsInRange,
    guestInRange,
    totalVisits,
    visitsLast7Days,
    totalGuestbookEntries,
    newGuestbook24h,
    settings,
  ] = await Promise.all([
    prisma.siteVisit.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: { createdAt: true },
    }),
    prisma.guestbookEntry.findMany({
      where: {
        authorType: GuestbookAuthorType.GUEST,
        createdAt: { gte: rangeStart },
      },
      select: { createdAt: true },
    }),
    prisma.siteVisit.count(),
    prisma.siteVisit.count({
      where: { createdAt: { gte: sevenDaysStart } },
    }),
    prisma.guestbookEntry.count(),
    prisma.guestbookEntry.count({
      where: {
        authorType: GuestbookAuthorType.GUEST,
        createdAt: { gte: dayAgo },
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  return {
    visitSeries: bucketBySeoulDay(visitsInRange, dayKeys),
    guestbookSeries: bucketBySeoulDay(guestInRange, dayKeys),
    totals: {
      totalVisits,
      visitsLast7Days,
      totalGuestbookEntries,
      newGuestbook24h,
    },
    guestbookSubmissionsOpen: settings?.guestbookSubmissionsOpen ?? true,
  };
}
