"use client";

import ProjectDragGrip from "@/components/projects/ProjectDragGrip";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
};

export default function ProjectsSectionSortableItem({ id, children }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative w-full min-w-0 md:flex md:h-full md:w-auto md:min-w-0 ${
        isDragging ? "z-50 opacity-[0.93] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.25)]" : ""
      }`}
    >
      <ProjectDragGrip
        className="absolute left-2.5 top-2.5 z-20"
        {...listeners}
        {...attributes}
      />
      {children}
    </li>
  );
}
