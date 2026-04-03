"use client";

import type { SkillCategory } from "@/data/skillCategories";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AiOutlineEdit } from "react-icons/ai";

const glassIconButton =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/[0.32] text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_1px_3px_rgba(15,23,42,0.05)] backdrop-blur-md backdrop-saturate-150 transition-[color,background-color,box-shadow,border-color] hover:border-white/70 hover:bg-white/[0.42] hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/40";

const glassField =
  "box-border w-full rounded-lg border border-zinc-300/45 bg-white/[0.35] px-2.5 py-1.5 text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-md backdrop-saturate-150 outline-none ring-0 transition-[border-color,background-color,box-shadow] placeholder:text-zinc-400 focus:border-sky-400/55 focus:bg-white/[0.48] focus:ring-1 focus:ring-sky-400/25";

/** 고정 높이 · 사용자 리사이즈 비활성, 긴 텍스트는 내부 스크롤 */
const glassFieldFixed = `${glassField} resize-none overflow-y-auto`;

const glassPill =
  "rounded-full border border-white/50 bg-white/[0.3] px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-md backdrop-saturate-150 transition-[color,background-color] hover:bg-white/[0.42] hover:text-zinc-800 disabled:opacity-45";

const glassPillPrimary =
  "rounded-full border border-sky-300/35 bg-sky-500/15 px-3.5 py-1.5 text-xs font-medium text-sky-900/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-md backdrop-saturate-150 transition-[background-color,color] hover:bg-sky-500/22 disabled:opacity-45";

type Props = {
  category: SkillCategory;
  variant: "grid" | "carousel";
  children: ReactNode;
};

export default function AdminSkillCategoryEdit({
  category,
  variant,
  children,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [techStack, setTechStack] = useState(category.techStack);
  const [description, setDescription] = useState(category.description);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) return;
    setTechStack(category.techStack);
    setDescription(category.description);
  }, [category.techStack, category.description, editing]);

  const cancel = useCallback(() => {
    setEditing(false);
    setError(null);
    setTechStack(category.techStack);
    setDescription(category.description);
  }, [category.description, category.techStack]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/skills/${encodeURIComponent(category.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techStack, description }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const isGrid = variant === "grid";

  return (
    <>
      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`absolute right-2 top-2 z-[35] ${glassIconButton}`}
          aria-label={`${category.title} 카드 내용 수정`}
          title="수정"
        >
          <AiOutlineEdit className="h-[1.05rem] w-[1.05rem]" aria-hidden />
        </button>
      ) : null}

      {children}

      {editing ? (
        <div className={isGrid ? "mt-2 space-y-2" : "relative mt-2 space-y-2"}>
          <label
            className={
              isGrid
                ? "block w-full text-left"
                : "mx-auto block w-full max-w-[15.5rem] text-left"
            }
          >
            <span className="sr-only">기술 스택</span>
            <textarea
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className={`${glassFieldFixed} ${isGrid ? "h-[2.125rem]" : "h-[3.5rem]"} ${isGrid ? "text-xs font-medium leading-snug md:text-[0.8125rem]" : "text-center text-[0.75rem] font-medium leading-snug tracking-[-0.012em]"}`}
            />
          </label>
          <label
            className={
              isGrid
                ? "block w-full text-left"
                : "mx-auto block w-full max-w-[15.5rem] text-left"
            }
          >
            <span className="sr-only">설명</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${glassFieldFixed} h-[3.75rem] ${isGrid ? "text-xs leading-snug md:text-[0.8125rem]" : "text-center text-[0.75rem] font-normal leading-[1.55] tracking-[-0.01em]"}`}
            />
          </label>
          {error ? (
            <p className="text-center text-xs text-red-600/95" role="alert">
              {error}
            </p>
          ) : null}
          <div
            className={`flex flex-wrap items-center gap-1.5 pt-1 ${isGrid ? "justify-end" : "justify-center"}`}
            role="group"
            aria-label="편집 저장 또는 취소"
          >
            <button
              type="button"
              onClick={cancel}
              disabled={saving}
              className={glassPill}
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className={glassPillPrimary}
            >
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
      ) : isGrid ? (
        <>
          <p className="mt-2 text-sm font-medium leading-snug text-zinc-600 md:mt-2 md:text-[0.9375rem] md:leading-snug">
            {category.techStack}
          </p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-zinc-500 md:mt-3 md:text-base md:leading-relaxed">
            {category.description}
          </p>
        </>
      ) : (
        <>
          <section
            aria-label="사용 기술"
            className="relative mx-auto mt-3.5 w-full max-w-[17.25rem] rounded-xl border border-zinc-200/55 bg-zinc-50/85 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
          >
            <p className="text-center text-[0.8125rem] font-medium leading-snug tracking-[-0.012em] text-zinc-600">
              {category.techStack}
            </p>
          </section>
          <p className="relative mx-auto mt-3.5 max-w-[15.5rem] text-center text-[0.8125rem] font-normal leading-[1.62] tracking-[-0.01em] text-zinc-500">
            {category.description}
          </p>
        </>
      )}
    </>
  );
}
