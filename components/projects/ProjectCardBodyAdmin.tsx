"use client";

import AdminProjectCardToolbar from "@/components/projects/AdminProjectCardToolbar";
import type { Project } from "@/data/projects";
import type { ProjectKindTagValue } from "@/lib/project-kind-tags";

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
  ephemeralNew?: boolean;
  onEphemeralPersisted?: () => void;
  onEphemeralAbandoned?: () => void;
  onEphemeralHideOptimistic?: () => void;
  onEphemeralShowAgain?: () => void;
  onProjectSavedLocally?: (next: Project) => void;
};

/**
 * 관리자 카드 본문(툴바).
 * 썸네일 상태는 부모(`ProjectCardAdmin`)에서 이미지 영역과 동기화합니다.
 */
export default function ProjectCardBodyAdmin({
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
  ephemeralNew = false,
  onEphemeralPersisted,
  onEphemeralAbandoned,
  onEphemeralHideOptimistic,
  onEphemeralShowAgain,
  onProjectSavedLocally,
}: Props) {
  return (
    <AdminProjectCardToolbar
      project={project}
      canMutate={canMutate}
      editing={editing}
      onEditingChange={onEditingChange}
      thumbnailUrl={thumbnailUrl}
      setThumbnailUrl={setThumbnailUrl}
      uploadingThumb={uploadingThumb}
      thumbError={thumbError}
      onThumbErrorClear={onThumbErrorClear}
      storageReady={storageReady}
      kindTags={kindTags}
      setKindTags={setKindTags}
      techTagsEdit={techTagsEdit}
      setTechTagsEdit={setTechTagsEdit}
      ephemeralNew={ephemeralNew}
      onEphemeralPersisted={onEphemeralPersisted}
      onEphemeralAbandoned={onEphemeralAbandoned}
      onEphemeralHideOptimistic={onEphemeralHideOptimistic}
      onEphemeralShowAgain={onEphemeralShowAgain}
      onProjectSavedLocally={onProjectSavedLocally}
    />
  );
}
