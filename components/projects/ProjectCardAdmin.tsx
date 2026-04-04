"use client";

import Image from "next/image";
import ProjectCardBodyAdmin from "@/components/projects/ProjectCardBodyAdmin";
import {
  ProjectCardBadgeList,
  ThumbFallback,
} from "@/components/projects/project-card-shared";
import type { Project } from "@/data/projects";
import { isFirebaseStorageConfigured } from "@/lib/firebase/client";
import {
  kindValuesToStatusChipLabels,
  statusChipLabelsToKindValues,
  type ProjectKindTagValue,
} from "@/lib/project-kind-tags";
import { uploadProjectThumbnail } from "@/lib/firebase/uploadProjectThumbnail";
import ProjectCardCreateSkeleton from "@/components/projects/ProjectCardCreateSkeleton";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

type Props = {
  project: Project;
  canMutate: boolean;
  autoEditOnce?: boolean;
  onAutoEditConsumed?: () => void;
  localDraft?: boolean;
  onEphemeralPersisted?: () => void;
  onEphemeralAbandoned?: () => void;
  onEphemeralHideOptimistic?: () => void;
  onEphemeralShowAgain?: () => void;
  onProjectSavedLocally?: (next: Project) => void;
  /** 편집 모드 여부를 상위에 알려 새 카드 추가 버튼을 막을 때 사용 */
  onReportEditing?: (active: boolean) => void;
  summary: ReactNode;
  techList: ReactNode;
  footer: ReactNode;
};

export default function ProjectCardAdmin({
  project,
  canMutate,
  autoEditOnce = false,
  onAutoEditConsumed,
  localDraft = false,
  onEphemeralPersisted,
  onEphemeralAbandoned,
  onEphemeralHideOptimistic,
  onEphemeralShowAgain,
  onProjectSavedLocally,
  onReportEditing,
  summary,
  techList,
  footer,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(project.image ?? "");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [thumbError, setThumbError] = useState<string | null>(null);
  const [kindTags, setKindTags] = useState<ProjectKindTagValue[]>(() =>
    statusChipLabelsToKindValues(project.statusChips),
  );
  const [techTagsEdit, setTechTagsEdit] = useState<string[]>(() => [
    ...project.techTags,
  ]);
  const [createPosting, setCreatePosting] = useState(false);
  const thumbFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) return;
    setThumbnailUrl(project.image ?? "");
    setThumbError(null);
    setKindTags(statusChipLabelsToKindValues(project.statusChips));
    setTechTagsEdit([...project.techTags]);
  }, [project, editing]);

  useEffect(() => {
    if (editing) setThumbError(null);
  }, [editing]);

  useEffect(() => {
    if (!autoEditOnce) return;
    setEditing(true);
    onAutoEditConsumed?.();
  }, [autoEditOnce, onAutoEditConsumed]);

  useEffect(() => {
    onReportEditing?.(editing);
    return () => {
      /** 취소로 초안 카드가 먼저 언마운트되면 `editing: false` 렌더 없이 끝나므로 반드시 잠금 해제 */
      onReportEditing?.(false);
    };
  }, [editing, onReportEditing]);

  const onThumbnailFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingThumb(true);
    setThumbError(null);
    try {
      const url = await uploadProjectThumbnail(project.id, file);
      setThumbnailUrl(url);
    } catch (err) {
      setThumbError(
        err instanceof Error ? err.message : "썸네일 업로드에 실패했습니다.",
      );
    } finally {
      setUploadingThumb(false);
    }
  };

  const storageReady = isFirebaseStorageConfigured();

  const badgeProject: Project = editing
    ? {
        ...project,
        statusChips: kindValuesToStatusChipLabels(kindTags),
      }
    : project;

  if (localDraft && createPosting) {
    return <ProjectCardCreateSkeleton />;
  }

  return (
    <>
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100">
        <div
          className="pointer-events-none absolute inset-0 z-[1] ring-1 ring-inset ring-zinc-900/[0.04]"
          aria-hidden
        />
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={`${project.title} 대표 화면`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 88vw, 33vw"
          />
        ) : (
          <ThumbFallback projectId={project.id} title={project.title} />
        )}

        <ProjectCardBadgeList project={badgeProject} />

        {editing ? (
          <>
            <input
              ref={thumbFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(ev) => void onThumbnailFile(ev)}
            />
            <div
              className="absolute inset-0 z-[3] flex items-center justify-center"
              aria-hidden={!storageReady}
            >
              <button
                type="button"
                disabled={uploadingThumb || !storageReady}
                onClick={() => thumbFileRef.current?.click()}
                className="flex h-full w-full cursor-pointer items-center justify-center bg-zinc-950/[0.03] transition-colors hover:bg-zinc-950/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={
                  uploadingThumb
                    ? "이미지 업로드 중"
                    : "대표 사진 바꾸기 · 저장 버튼을 눌러 반영"
                }
                title={
                  storageReady
                    ? "클릭하여 사진 선택 · 저장 시 서버에 반영됩니다"
                    : "Firebase 설정이 필요합니다"
                }
              >
                <span
                  className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/65 bg-white/45 text-zinc-500/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-[3px] md:h-9 md:w-9 md:text-zinc-500/75"
                  aria-hidden
                >
                  <AiOutlinePlus
                    className="h-[0.95rem] w-[0.95rem] md:h-4 md:w-4"
                    strokeWidth={1.65}
                  />
                </span>
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-hidden px-4 pb-4 pt-3.5 md:px-5 md:pb-5 md:pt-4">
        <ProjectCardBodyAdmin
          project={project}
          canMutate={canMutate}
          editing={editing}
          onEditingChange={setEditing}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          uploadingThumb={uploadingThumb}
          thumbError={thumbError}
          onThumbErrorClear={() => setThumbError(null)}
          storageReady={storageReady}
          kindTags={kindTags}
          setKindTags={setKindTags}
          techTagsEdit={techTagsEdit}
          setTechTagsEdit={setTechTagsEdit}
          localDraft={localDraft}
          onEphemeralPersisted={onEphemeralPersisted}
          onEphemeralAbandoned={onEphemeralAbandoned}
          onEphemeralHideOptimistic={onEphemeralHideOptimistic}
          onEphemeralShowAgain={onEphemeralShowAgain}
          onProjectSavedLocally={onProjectSavedLocally}
          onLocalDraftPostingChange={setCreatePosting}
        />
        {!editing ? summary : null}
        {!editing ? (
          <>
            {techList}
            {footer}
          </>
        ) : (
          <div
            className="mt-auto min-h-0 min-w-0 flex-1 basis-0"
            aria-hidden
          />
        )}
      </div>
    </>
  );
}
