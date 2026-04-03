"use client";

import ProjectDragGrip from "@/components/projects/ProjectDragGrip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  /** 편집 모달·인라인 폼 열림 등 — 드래그만 끄고 DOM 구조(Sortable `li`)는 유지해 레이아웃이 덜컥거리지 않게 함 */
  dragDisabled?: boolean;
};

export default function CertsSectionSortableItem({
  id,
  children,
  dragDisabled = false,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative w-full min-w-0 md:flex md:h-full md:min-h-0 ${
        isDragging ? "z-50 opacity-[0.93] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)]" : ""
      }`}
    >
      {!dragDisabled ? (
        <ProjectDragGrip
          className="absolute left-2.5 top-2.5 z-20"
          {...listeners}
          {...attributes}
        />
      ) : null}
      {children}
    </li>
  );
}
