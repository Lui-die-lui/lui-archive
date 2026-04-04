"use client";

import type { Project } from "@/data/projects";
import {
  PROJECT_KIND_TAG_OPTIONS,
  kindValuesToStatusChipLabels,
  type ProjectKindTagValue,
  statusChipLabelsToKindValues,
} from "@/lib/project-kind-tags";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const iconBtn =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200/70 bg-white/85 text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-md backdrop-saturate-150 transition-[color,background-color,border-color,box-shadow] hover:border-zinc-300/80 hover:bg-white hover:text-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400/50 disabled:pointer-events-none disabled:opacity-35";

const fieldBox =
  "box-border w-full min-w-0 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-[border-color,box-shadow] focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 md:focus:ring-inset";

const labelCol =
  "w-[5.25rem] shrink-0 text-xs font-semibold leading-snug tracking-wide text-zinc-600 md:w-[6.5rem] md:text-sm";

type Props = {
  project: Project;
  canMutate: boolean;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
  uploadingThumb: boolean;
  thumbError: string | null;
  onThumbErrorClear: () => void;
  storageReady: boolean;
  kindTags: ProjectKindTagValue[];
  setKindTags: (v: ProjectKindTagValue[]) => void;
  techTagsEdit: string[];
  setTechTagsEdit: (v: string[]) => void;
  /** 아직 DB에 없는 초안 카드 — 저장 시 POST, 취소 시 클라이언트에서만 제거 */
  localDraft?: boolean;
  onEphemeralPersisted?: () => void;
  onEphemeralAbandoned?: () => void;
  onEphemeralHideOptimistic?: () => void;
  onEphemeralShowAgain?: () => void;
  onProjectSavedLocally?: (next: Project) => void;
  /** 로컬 초안을 POST로 저장하는 동안 true — 카드 스켈레톤 표시용 */
  onLocalDraftPostingChange?: (posting: boolean) => void;
};

export default function AdminProjectCardToolbar({
  project,
  canMutate,
  editing,
  onEditingChange,
  thumbnailUrl,
  setThumbnailUrl,
  uploadingThumb,
  thumbError,
  onThumbErrorClear,
  storageReady,
  kindTags,
  setKindTags,
  techTagsEdit,
  setTechTagsEdit,
  localDraft = false,
  onEphemeralPersisted,
  onEphemeralAbandoned,
  onEphemeralHideOptimistic,
  onEphemeralShowAgain,
  onProjectSavedLocally,
  onLocalDraftPostingChange,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title);
  const [summary, setSummary] = useState(project.summary);
  const [readmeUrl, setReadmeUrl] = useState(project.readmeUrl);
  const [deployUrl, setDeployUrl] = useState(project.liveUrl ?? "");
  const [techDraft, setTechDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) return;
    setTitle(project.title);
    setSummary(project.summary);
    setReadmeUrl(project.readmeUrl);
    setDeployUrl(project.liveUrl ?? "");
  }, [project, editing]);

  const resetDraftsFromProject = useCallback(() => {
    setKindTags(statusChipLabelsToKindValues(project.statusChips));
    setTechTagsEdit([...project.techTags]);
  }, [project, setKindTags, setTechTagsEdit]);

  const cancel = useCallback(async () => {
    if (localDraft) {
      setError(null);
      onEphemeralAbandoned?.();
      onEditingChange(false);
      return;
    }

    onEditingChange(false);
    setError(null);
    onThumbErrorClear();
    setTitle(project.title);
    setSummary(project.summary);
    setReadmeUrl(project.readmeUrl);
    setDeployUrl(project.liveUrl ?? "");
    setThumbnailUrl(project.image ?? "");
    resetDraftsFromProject();
    setTechDraft("");
  }, [
    localDraft,
    onEditingChange,
    onEphemeralAbandoned,
    onThumbErrorClear,
    project,
    resetDraftsFromProject,
    router,
    setThumbnailUrl,
  ]);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      if (localDraft) {
        onLocalDraftPostingChange?.(true);
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            summary: summary.trim(),
            readmeUrl: readmeUrl.trim(),
            deployUrl: deployUrl.trim() || undefined,
            thumbnailUrl: thumbnailUrl.trim() || undefined,
            kindTags,
            techTags: techTagsEdit,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          publicId?: string;
        };
        if (!res.ok || !data.publicId) {
          setError(data.error ?? "저장에 실패했습니다.");
          return;
        }
        await router.refresh();
        onEphemeralPersisted?.();
        onEditingChange(false);
        return;
      }

      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(project.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            summary: summary.trim(),
            readmeUrl: readmeUrl.trim(),
            deployUrl: deployUrl.trim(),
            thumbnailUrl: thumbnailUrl.trim(),
            kindTags,
            techTags: techTagsEdit,
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "저장에 실패했습니다.");
        return;
      }
      const nextProject: Project = {
        id: project.id,
        title: title.trim(),
        summary: summary.trim(),
        readmeUrl: readmeUrl.trim(),
        liveUrl: deployUrl.trim() || undefined,
        image: thumbnailUrl.trim() || null,
        statusChips: kindValuesToStatusChipLabels(kindTags),
        techTags: [...techTagsEdit],
      };
      onProjectSavedLocally?.(nextProject);
      onEphemeralPersisted?.();
      onEditingChange(false);
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setBusy(false);
      if (localDraft) onLocalDraftPostingChange?.(false);
    }
  };

  const remove = async () => {
    if (localDraft) {
      if (!window.confirm(`「${project.title}」초안을 삭제할까요?`)) return;
      setError(null);
      onEphemeralAbandoned?.();
      return;
    }
    if (!canMutate) return;
    if (!window.confirm(`「${project.title}」프로젝트를 삭제할까요?`)) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/projects/${encodeURIComponent(project.id)}`,
        { method: "DELETE" },
      );
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "삭제에 실패했습니다.");
        return;
      }
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setBusy(false);
    }
  };

  function toggleKind(value: ProjectKindTagValue) {
    const set = new Set(kindTags);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    setKindTags([...set]);
  }

  function addTech() {
    const t = techDraft.trim();
    if (!t) return;
    if (techTagsEdit.includes(t)) {
      setTechDraft("");
      return;
    }
    if (techTagsEdit.length >= 40) return;
    setTechTagsEdit([...techTagsEdit, t]);
    setTechDraft("");
  }

  if (!canMutate && !localDraft) return null;

  return (
    <>
      <div className="flex w-full min-w-0 max-w-full items-center justify-between gap-2">
        {editing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-h-10 min-w-0 max-w-full flex-1 basis-0 rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-[0.9375rem] font-semibold uppercase leading-snug tracking-[0.06em] text-zinc-900 outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 md:text-base md:focus:ring-inset"
            aria-label="프로젝트 제목"
          />
        ) : (
          <h3 className="flex min-h-10 min-w-0 max-w-full flex-1 basis-0 items-center gap-2 break-words text-[0.9375rem] font-semibold uppercase tracking-[0.06em] text-zinc-900 md:text-base">
            {localDraft ? (
              <span className="shrink-0 rounded-full border border-amber-200/80 bg-amber-50/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-900">
                초안
              </span>
            ) : null}
            <span className="min-w-0">{project.title}</span>
          </h3>
        )}
        {/*
          편집 전(아이콘 2개)과 편집 중(취소·저장) 오른쪽 너비가 달라지면 제목 줄바꿈·요약 문단이 덜컥거립니다.
          액션 슬롯 최소 너비를 편집 중 기준으로 맞춥니다.
        */}
        <div className="flex h-10 min-w-[9.25rem] shrink-0 items-center justify-end gap-1">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => void cancel()}
                disabled={busy || uploadingThumb}
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 px-3 text-[10px] font-medium text-zinc-600 backdrop-blur-sm hover:bg-zinc-50 disabled:opacity-45"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void save()}
                disabled={busy || uploadingThumb}
                className="inline-flex h-10 items-center justify-center rounded-full border border-sky-200/60 bg-sky-500/10 px-3 text-[10px] font-medium text-sky-900 backdrop-blur-sm hover:bg-sky-500/15 disabled:opacity-45"
              >
                {busy ? "저장중" : "저장"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEditingChange(true)}
                disabled={busy}
                className={iconBtn}
                aria-label={`${project.title} 수정`}
                title="수정"
              >
                <AiOutlineEdit className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => void remove()}
                disabled={busy}
                className={iconBtn}
                aria-label={`${project.title} 삭제`}
                title="삭제"
              >
                <AiOutlineDelete className="h-4 w-4" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>

      {error && !editing ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {editing ? (
        <div className="mt-3 w-full min-w-0 max-w-full max-h-[min(52vh,22rem)] overflow-y-auto overflow-x-hidden overscroll-y-contain border-t border-zinc-100/90 pt-3 pr-0.5 md:max-h-[min(40vh,14rem)]">
          <div className="min-w-0 space-y-3">
            {uploadingThumb ? (
              <p className="text-[10px] text-zinc-500">이미지 업로드 중…</p>
            ) : null}
            {thumbError ? (
              <p className="text-[11px] text-red-600" role="alert">
                {thumbError}
              </p>
            ) : null}
            {!storageReady ? (
              <p className="text-[10px] leading-snug text-amber-800">
                Firebase Web 설정이 필요합니다.{" "}
                <code className="rounded bg-amber-100/80 px-0.5 font-mono text-[9px]">
                  NEXT_PUBLIC_FIREBASE_API_KEY
                </code>
                ,{" "}
                <code className="rounded bg-amber-100/80 px-0.5 font-mono text-[9px]">
                  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
                </code>{" "}
                등을 .env에 넣고 개발 서버를 다시 시작해 주세요.
              </p>
            ) : null}
            {thumbnailUrl.trim() !== (project.image ?? "").trim() ? (
              <p className="text-[10px] text-zinc-500">
                썸네일이 변경되었습니다. 저장하면 적용됩니다.
              </p>
            ) : null}

            <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 gap-y-0 md:grid-cols-[6.5rem_1fr]">
              <span className={labelCol}>유형</span>
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {PROJECT_KIND_TAG_OPTIONS.map((opt) => {
                  const on = kindTags.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleKind(opt.value)}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] transition-colors ${
                        on
                          ? "border-sky-300/70 bg-sky-500/15 text-sky-950"
                          : "border-zinc-200/80 bg-zinc-50/90 text-zinc-500 hover:border-zinc-300 hover:bg-white"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 gap-y-0 md:grid-cols-[6.5rem_1fr]">
              <span className={labelCol}>기술</span>
              <div className="min-w-0 space-y-2">
                <div className="flex min-w-0 flex-wrap gap-1.5">
                  {techTagsEdit.map((t) => (
                    <span
                      key={t}
                      className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#D7E4EE] bg-[#F4F8FB] px-2 py-0.5 text-[11px] text-[#5E7486]"
                    >
                      <span className="truncate">{t}</span>
                      <button
                        type="button"
                        className="shrink-0 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
                        aria-label={`${t} 제거`}
                        onClick={() =>
                          setTechTagsEdit(techTagsEdit.filter((x) => x !== t))
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex min-w-0 gap-2">
                  <input
                    type="text"
                    value={techDraft}
                    onChange={(e) => setTechDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech();
                      }
                    }}
                    className={`${fieldBox} min-w-0 flex-1 font-sans`}
                    placeholder="기술 이름 후 Enter 또는 추가"
                    maxLength={120}
                  />
                  <button
                    type="button"
                    onClick={addTech}
                    className="shrink-0 rounded-lg border border-zinc-200/80 bg-white px-2.5 py-2 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 md:grid-cols-[6.5rem_1fr]">
              <span className={labelCol}>요약</span>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className={`${fieldBox} resize-none leading-relaxed`}
              />
            </div>

            <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 md:grid-cols-[6.5rem_1fr]">
              <span className={labelCol}>README</span>
              <input
                type="url"
                value={readmeUrl}
                onChange={(e) => setReadmeUrl(e.target.value)}
                className={`${fieldBox} font-mono text-xs`}
              />
            </div>

            <div className="grid grid-cols-[5.25rem_1fr] items-center gap-x-3 md:grid-cols-[6.5rem_1fr]">
              <span className={labelCol}>배포 URL</span>
              <input
                type="url"
                value={deployUrl}
                onChange={(e) => setDeployUrl(e.target.value)}
                className={`${fieldBox} font-mono text-xs`}
              />
            </div>

            {error ? (
              <p className="text-[11px] text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
