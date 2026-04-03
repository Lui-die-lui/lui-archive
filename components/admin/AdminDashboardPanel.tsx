"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminDashboardPayload } from "@/lib/dashboard-stats";

type Props = {
  data: AdminDashboardPayload;
};

function shortDayLabel(yyyyMmDd: string) {
  const [, m, d] = yyyyMmDd.split("-");
  return `${m}/${d}`;
}

export default function AdminDashboardPanel({ data }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(data.guestbookSubmissionsOpen);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  useEffect(() => {
    setOpen(data.guestbookSubmissionsOpen);
  }, [data.guestbookSubmissionsOpen]);

  const visitChart = data.visitSeries.map((r) => ({
    label: shortDayLabel(r.day),
    count: r.count,
  }));

  const gbChart = data.guestbookSeries.map((r) => ({
    label: shortDayLabel(r.day),
    count: r.count,
  }));

  async function setSubmissions(next: boolean) {
    setToggleError(null);
    setToggleLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ guestbookSubmissionsOpen: next }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setToggleError(j.error ?? "저장하지 못했습니다.");
        return;
      }
      setOpen(next);
      router.refresh();
    } catch {
      setToggleError("네트워크 오류가 발생했습니다.");
    } finally {
      setToggleLoading(false);
    }
  }

  /** Tailwind `h-56` 과 동일 — ResponsiveContainer 에 숫자 높이를 주면 초기 측정 오류를 줄임 */
  const chartHeightPx = 224;

  const chartClass =
    "min-w-0 rounded-xl border border-zinc-200/70 bg-white/50 p-3 shadow-[0_4px_24px_rgba(15,23,42,0.04)]";

  return (
    <div className="mt-10 space-y-10">
      <section aria-labelledby="dash-stats">
        <h2
          id="dash-stats"
          className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
        >
          요약
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200/70 bg-white/60 px-4 py-3">
            <dt className="text-[11px] font-medium text-zinc-500">누적 방문</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-900">
              {data.totals.totalVisits.toLocaleString("ko-KR")}
            </dd>
            <p className="mt-0.5 text-[10px] text-zinc-400">하루 1회·브라우저 기준</p>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/60 px-4 py-3">
            <dt className="text-[11px] font-medium text-zinc-500">최근 7일 방문</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-900">
              {data.totals.visitsLast7Days.toLocaleString("ko-KR")}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/60 px-4 py-3">
            <dt className="text-[11px] font-medium text-zinc-500">방명록 전체</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-900">
              {data.totals.totalGuestbookEntries.toLocaleString("ko-KR")}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200/70 bg-white/60 px-4 py-3">
            <dt className="text-[11px] font-medium text-zinc-500">새 방명록(24h)</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-900">
              {data.totals.newGuestbook24h.toLocaleString("ko-KR")}
            </dd>
            <p className="mt-0.5 text-[10px] text-zinc-400">게스트 글만</p>
          </div>
        </dl>
      </section>

      <section aria-labelledby="dash-guestbook-control">
        <h2
          id="dash-guestbook-control"
          className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
        >
          방명록 수신
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          도배·악성 글이 있을 때 새 글 접수를 잠시 막을 수 있습니다. 기존 글 조회는 유지됩니다.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={open}
            disabled={toggleLoading}
            onClick={() => void setSubmissions(!open)}
            className={`relative inline-flex h-8 w-14 shrink-0 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/60 disabled:opacity-50 ${
              open
                ? "border-sky-300/60 bg-sky-200/50"
                : "border-zinc-200/80 bg-zinc-100"
            }`}
          >
            <span
              className={`pointer-events-none absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-white shadow transition-transform ${
                open ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-zinc-800">
            {open ? "수신 중" : "수신 중지"}
          </span>
          {toggleLoading ? (
            <span className="text-xs text-zinc-400">저장 중…</span>
          ) : null}
        </div>
        {toggleError ? (
          <p className="mt-2 text-sm text-rose-700" role="alert">
            {toggleError}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="dash-charts">
        <h2
          id="dash-charts"
          className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400"
        >
          추이 (최근 14일, 한국 시간 일자)
        </h2>
        <div className="mt-4 grid min-w-0 gap-6 lg:grid-cols-2">
          <div className={chartClass}>
            <p className="mb-2 px-1 text-xs font-medium text-zinc-600">일별 방문</p>
            <div className="w-full min-w-0" style={{ height: chartHeightPx }}>
              <ResponsiveContainer width="100%" height={chartHeightPx}>
                <AreaChart data={visitChart} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    width={32}
                    tick={{ fontSize: 10, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(value) => {
                      const n = typeof value === "number" ? value : Number(value);
                      const text = Number.isFinite(n)
                        ? n.toLocaleString("ko-KR")
                        : String(value ?? "");
                      return [text, "방문"];
                    }}
                    labelFormatter={(l) => `${l} (KST)`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#0ea5e9"
                    strokeWidth={1.5}
                    fill="url(#fillVisits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={chartClass}>
            <p className="mb-2 px-1 text-xs font-medium text-zinc-600">
              일별 새 방명록 (게스트)
            </p>
            <div className="w-full min-w-0" style={{ height: chartHeightPx }}>
              <ResponsiveContainer width="100%" height={chartHeightPx}>
                <AreaChart data={gbChart} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillGb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    width={32}
                    tick={{ fontSize: 10, fill: "#71717a" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "1px solid #e4e4e7",
                      fontSize: "12px",
                    }}
                    formatter={(value) => {
                      const n = typeof value === "number" ? value : Number(value);
                      const text = Number.isFinite(n)
                        ? n.toLocaleString("ko-KR")
                        : String(value ?? "");
                      return [text, "글 수"];
                    }}
                    labelFormatter={(l) => `${l} (KST)`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    fill="url(#fillGb)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
