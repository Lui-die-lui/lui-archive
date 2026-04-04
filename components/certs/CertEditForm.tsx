"use client";

import type { Cert } from "@/data/certs";
import CertCardCreateSkeleton from "@/components/certs/CertCardCreateSkeleton";
import {
  formatIssuedAtLabel,
  ISSUED_MONTH_SHORT,
  parseIssuedAtLabel,
} from "@/lib/cert-issued-label";
import { useEffect, useState } from "react";

const fieldBox =
  "box-border w-full min-w-0 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 md:focus:ring-inset";

const labelCol =
  "w-[5.25rem] shrink-0 text-xs font-semibold leading-snug tracking-wide text-zinc-600 md:w-[6.5rem] md:text-sm";

const YEARS = Array.from({ length: 16 }, (_, i) => 2020 + i);

export type CertEditPayload = {
  title: string;
  issuer: string;
  issuedAtLabel: string;
  url: string | null;
};

type Props = {
  cert: Cert;
  variant: "inline" | "modal";
  busy: boolean;
  /** 신규(POST) 저장 중일 때 자격증 카드 크기의 스켈레톤 */
  useCreatePostSkeleton?: boolean;
  onCancel: () => void;
  onSave: (payload: CertEditPayload) => void | Promise<void>;
};

export default function CertEditForm({
  cert,
  variant,
  busy,
  useCreatePostSkeleton = false,
  onCancel,
  onSave,
}: Props) {
  const parsed = parseIssuedAtLabel(cert.issuedAt);
  const [title, setTitle] = useState(cert.title);
  const [issuer, setIssuer] = useState(cert.issuer);
  const [url, setUrl] = useState(cert.url ?? "");
  const [monthIndex0, setMonthIndex0] = useState(parsed.monthIndex0);
  const [year, setYear] = useState(parsed.year);

  useEffect(() => {
    const p = parseIssuedAtLabel(cert.issuedAt);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setUrl(cert.url ?? "");
    setMonthIndex0(p.monthIndex0);
    setYear(p.year);
  }, [cert]);

  const shell =
    variant === "inline"
      ? "rounded-2xl border border-[#D7E4EE]/90 bg-[#F4F8FB]/95 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:hidden"
      : "";

  async function submit() {
    const u = url.trim();
    const issuedAtLabel = formatIssuedAtLabel(monthIndex0, year);
    await onSave({
      title: title.trim(),
      issuer: issuer.trim(),
      issuedAtLabel,
      url: u || null,
    });
  }

  if (busy && useCreatePostSkeleton) {
    const skeletonWrap =
      variant === "inline"
        ? shell
        : "w-full min-w-0 min-h-[7.5rem] py-2";
    return (
      <div className={skeletonWrap}>
        <CertCardCreateSkeleton />
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className="space-y-3">
        <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 md:grid-cols-[6.5rem_1fr]">
          <span className={labelCol}>이름</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={fieldBox}
            aria-label="자격증 이름"
          />
        </div>
        <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 md:grid-cols-[6.5rem_1fr]">
          <span className={labelCol}>발행원</span>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className={fieldBox}
            aria-label="발행원"
          />
        </div>
        <div className="grid grid-cols-[5.25rem_1fr] items-start gap-x-3 gap-y-1 md:grid-cols-[6.5rem_1fr]">
          <span className={`${labelCol} pt-2`}>링크 (선택)</span>
          <div className="min-w-0 space-y-1">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`${fieldBox} font-mono text-xs`}
              placeholder="비우면 링크 없음"
              aria-label="확인 링크 URL (선택)"
            />
            <p className="text-[10px] leading-snug text-zinc-500">
              비워 두면 카드에 「링크 없음」이 표시됩니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 md:grid-cols-[6.5rem_1fr]">
          <span className={labelCol}>취득</span>
          <div className="flex min-w-0 flex-wrap gap-2">
            <select
              value={monthIndex0}
              onChange={(e) => setMonthIndex0(Number(e.target.value))}
              className={`${fieldBox} w-auto min-w-[5.5rem] flex-1`}
              aria-label="월"
            >
              {ISSUED_MONTH_SHORT.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={`${fieldBox} w-auto min-w-[5rem] flex-1`}
              aria-label="년"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 px-3 text-[10px] font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-45"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => void submit()}
          disabled={busy}
          className="inline-flex h-9 items-center justify-center rounded-full border border-sky-200/60 bg-sky-500/10 px-3 text-[10px] font-medium text-sky-900 hover:bg-sky-500/15 disabled:opacity-45"
        >
          {busy ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}
