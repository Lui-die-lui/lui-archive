"use client";

import {
  AdminNewProjectGhostDesktop,
  AdminNewProjectGhostMobile,
} from "@/components/projects/AdminNewProjectGhost";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/data/projects";
import ProjectsSectionSortableItem from "@/components/sections/ProjectsSectionSortableItem";
import Reveal from "@/components/ui/Reveal";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function projectDisplayEquals(a: Project, b: Project): boolean {
  const chips = (c: string[]) => [...c].sort().join("\0");
  const tags = (t: string[]) => [...t].sort().join("\0");
  return (
    a.title === b.title &&
    a.summary === b.summary &&
    a.readmeUrl === b.readmeUrl &&
    (a.liveUrl ?? "") === (b.liveUrl ?? "") &&
    (a.image ?? "") === (b.image ?? "") &&
    chips(a.statusChips) === chips(b.statusChips) &&
    tags(a.techTags) === tags(b.techTags)
  );
}

function mergeVisibleOrder(
  previousOrder: string[],
  newSortableOrder: string[],
  persistedSet: Set<string>,
): string[] {
  const queue = [...newSortableOrder];
  const out: string[] = [];
  for (const id of previousOrder) {
    if (persistedSet.has(id)) {
      const next = queue.shift();
      if (next) out.push(next);
    } else {
      out.push(id);
    }
  }
  return out;
}

type Props = {
  projects: Project[];
  persistedPublicIds: string[];
  adminEditable: boolean;
};

export default function ProjectsSectionClient({
  projects,
  persistedPublicIds,
  adminEditable,
}: Props) {
  const router = useRouter();
  const persisted = useMemo(
    () => new Set(persistedPublicIds),
    [persistedPublicIds],
  );
  const [creating, setCreating] = useState(false);
  const [autoEditPublicId, setAutoEditPublicId] = useState<string | null>(null);
  const [ephemeralNewIds, setEphemeralNewIds] = useState<string[]>([]);
  const [hiddenProjectIds, setHiddenProjectIds] = useState<string[]>([]);
  const [optimisticById, setOptimisticById] = useState<
    Record<string, Project>
  >({});
  /** 드래그 후·refresh 전까지 보이는 순서 */
  const [localVisibleOrder, setLocalVisibleOrder] = useState<string[] | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setHiddenProjectIds((prev) =>
      prev.filter((id) => projects.some((p) => p.id === id)),
    );
  }, [projects]);

  useEffect(() => {
    setOptimisticById((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of Object.keys(next)) {
        const server = projects.find((p) => p.id === id);
        const local = next[id];
        if (!server) {
          delete next[id];
          changed = true;
          continue;
        }
        if (projectDisplayEquals(server, local)) {
          delete next[id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [projects]);

  useEffect(() => {
    setLocalVisibleOrder(null);
  }, [projects]);

  const applySavedProject = useCallback((next: Project) => {
    setOptimisticById((prev) => ({ ...prev, [next.id]: next }));
  }, []);

  const hideProjectOptimistic = useCallback((publicId: string) => {
    setHiddenProjectIds((prev) =>
      prev.includes(publicId) ? prev : [...prev, publicId],
    );
  }, []);

  const unhideProject = useCallback((publicId: string) => {
    setHiddenProjectIds((prev) => prev.filter((id) => id !== publicId));
  }, []);

  const consumeAutoEdit = useCallback(() => {
    setAutoEditPublicId(null);
  }, []);

  const removeEphemeral = useCallback((publicId: string) => {
    setEphemeralNewIds((prev) => prev.filter((id) => id !== publicId));
  }, []);

  const handleCreateProject = useCallback(async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        publicId?: string;
      };
      if (!res.ok || !data.publicId) {
        window.alert(data.error ?? "프로젝트를 만들지 못했습니다.");
        return;
      }
      setEphemeralNewIds((prev) =>
        prev.includes(data.publicId!) ? prev : [...prev, data.publicId!],
      );
      setAutoEditPublicId(data.publicId);
      router.refresh();
    } catch {
      window.alert("네트워크 오류가 발생했습니다.");
    } finally {
      setCreating(false);
    }
  }, [router]);

  const visibleProjects = useMemo(
    () => projects.filter((p) => !hiddenProjectIds.includes(p.id)),
    [projects, hiddenProjectIds],
  );

  const defaultVisibleOrder = useMemo(
    () => visibleProjects.map((p) => p.id),
    [visibleProjects],
  );

  const effectiveVisibleOrder = localVisibleOrder ?? defaultVisibleOrder;

  const orderedVisibleProjects = useMemo(() => {
    return effectiveVisibleOrder
      .map((id) => visibleProjects.find((p) => p.id === id))
      .filter((p): p is Project => p != null);
  }, [effectiveVisibleOrder, visibleProjects]);

  const sortableIdsOrdered = useMemo(
    () =>
      orderedVisibleProjects
        .filter((p) => persisted.has(p.id))
        .map((p) => p.id),
    [orderedVisibleProjects, persisted],
  );

  const enableDnd =
    adminEditable && sortableIdsOrdered.length >= 2;

  const persistReorder = useCallback(
    async (newVisibleOrder: string[]) => {
      const hiddenTail = projects
        .filter((p) => hiddenProjectIds.includes(p.id))
        .map((p) => p.id);
      const fullOrder = [...newVisibleOrder, ...hiddenTail];

      if (fullOrder.length !== projects.length) {
        setLocalVisibleOrder(null);
        window.alert("순서를 저장할 수 없습니다. 페이지를 새로고침 해 주세요.");
        return;
      }
      const all = new Set(projects.map((p) => p.id));
      if (fullOrder.some((id) => !all.has(id)) || new Set(fullOrder).size !== fullOrder.length) {
        setLocalVisibleOrder(null);
        window.alert("순서 데이터가 올바르지 않습니다.");
        return;
      }

      try {
        const res = await fetch("/api/admin/projects/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedPublicIds: fullOrder }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setLocalVisibleOrder(null);
          window.alert(data.error ?? "순서 저장에 실패했습니다.");
          return;
        }
        router.refresh();
      } catch {
        setLocalVisibleOrder(null);
        window.alert("네트워크 오류가 발생했습니다.");
      }
    },
    [projects, hiddenProjectIds, router],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const sortableOrdered = sortableIdsOrdered;
      const activeId = String(active.id);
      const overId = String(over.id);
      const oldIndex = sortableOrdered.indexOf(activeId);
      const newIndex = sortableOrdered.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newSortableOrder = arrayMove(sortableOrdered, oldIndex, newIndex);
      const newVisibleOrder = mergeVisibleOrder(
        effectiveVisibleOrder,
        newSortableOrder,
        persisted,
      );
      setLocalVisibleOrder(newVisibleOrder);
      void persistReorder(newVisibleOrder);
    },
    [
      effectiveVisibleOrder,
      persistReorder,
      persisted,
      sortableIdsOrdered,
    ],
  );

  const addIdx = orderedVisibleProjects.length;

  const projectList = orderedVisibleProjects.map((project, i) => {
    const displayProject = optimisticById[project.id] ?? project;
    const card = (
      <Reveal
        delayMs={i * 90 + 220}
        threshold={0.25}
        className="h-full w-full min-w-0"
      >
        <ProjectCard
          project={displayProject}
          adminEditable={adminEditable}
          canMutate={persisted.has(project.id)}
          autoEditOnce={autoEditPublicId === project.id}
          onAutoEditConsumed={consumeAutoEdit}
          ephemeralNew={ephemeralNewIds.includes(project.id)}
          onEphemeralPersisted={() => removeEphemeral(project.id)}
          onEphemeralAbandoned={() => removeEphemeral(project.id)}
          onEphemeralHideOptimistic={() => hideProjectOptimistic(project.id)}
          onEphemeralShowAgain={() => unhideProject(project.id)}
          onProjectSavedLocally={applySavedProject}
        />
      </Reveal>
    );

    if (enableDnd && persisted.has(project.id)) {
      return (
        <ProjectsSectionSortableItem key={project.id} id={project.id}>
          {card}
        </ProjectsSectionSortableItem>
      );
    }

    return (
      <li
        key={project.id}
        className="w-full min-w-0 md:flex md:h-full md:w-auto md:min-w-0"
      >
        {card}
      </li>
    );
  });

  const ghostSlots =
    adminEditable ? (
      <>
        <li className="w-full min-w-0 md:hidden">
          <Reveal
            delayMs={addIdx * 90 + 220}
            threshold={0.25}
            className="h-full w-full min-w-0"
          >
            <AdminNewProjectGhostMobile
              disabled={creating}
              onClick={() => void handleCreateProject()}
            />
          </Reveal>
        </li>
        <li className="hidden w-full min-w-0 md:flex md:h-full md:w-auto md:min-w-0">
          <Reveal
            delayMs={addIdx * 90 + 220}
            threshold={0.25}
            className="h-full w-full min-w-0"
          >
            <AdminNewProjectGhostDesktop
              disabled={creating}
              onClick={() => void handleCreateProject()}
            />
          </Reveal>
        </li>
      </>
    ) : null;

  const ulClass =
    "mt-12 flex min-w-0 flex-col gap-4 md:grid md:min-w-0 md:grid-cols-3 md:gap-5 md:items-stretch";

  if (enableDnd) {
    return (
      <DndContext
        id="portfolio-projects-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableIdsOrdered}
          strategy={rectSortingStrategy}
        >
          <ul className={ulClass}>
            {projectList}
            {ghostSlots}
          </ul>
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <ul className={ulClass}>
      {projectList}
      {ghostSlots}
    </ul>
  );
}
