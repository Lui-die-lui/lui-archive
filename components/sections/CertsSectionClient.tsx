"use client";

import {
  AdminNewCertGhostDesktop,
  AdminNewCertGhostMobile,
} from "@/components/certs/AdminNewCertGhost";
import CertCard from "@/components/certs/CertCard";
import CertEditForm, {
  type CertEditPayload,
} from "@/components/certs/CertEditForm";
import CertsSectionSortableItem from "@/components/sections/CertsSectionSortableItem";
import SectionIntroHeader from "@/components/ui/SectionIntroHeader";
import AdminDismissibleModal from "@/components/ui/AdminDismissibleModal";
import Reveal from "@/components/ui/Reveal";
import type { Cert } from "@/data/certs";
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
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

/** 일괄 편집 모드 카드 우측 상단 — `react-icons/ai` */
const miniCardActionBtn =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200/85 bg-white/95 text-zinc-500 shadow-sm backdrop-blur-sm transition-[color,background-color,border-color,box-shadow] hover:border-zinc-300 hover:bg-white hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-45";

/**
 * 섹션 부제와 그리드 사이 · 우측 알약 버튼 (`h-9`는 카드 액션과 맞춤).
 */
const certsBulkEditPill =
  "inline-flex h-9 min-w-[4.75rem] shrink-0 items-center justify-center rounded-full border border-zinc-200/85 bg-white px-5 text-xs font-semibold tracking-tight text-zinc-700 shadow-sm transition-[color,background-color,border-color,box-shadow] hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50 sm:px-6";

type Props = {
  headerLabel: string;
  titleId: string;
  title: string;
  description: string;
  certs: Cert[];
  persistedCertIds: string[];
  adminEditable: boolean;
};

export default function CertsSectionClient({
  headerLabel,
  titleId,
  title,
  description,
  certs,
  persistedCertIds,
  adminEditable,
}: Props) {
  const router = useRouter();
  const persisted = useMemo(
    () => new Set(persistedCertIds),
    [persistedCertIds],
  );

  const [isMd, setIsMd] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [formBusy, setFormBusy] = useState(false);
  const [localOrder, setLocalOrder] = useState<string[] | null>(null);
  const [hiddenCertIds, setHiddenCertIds] = useState<string[]>([]);
  const [localDraftCerts, setLocalDraftCerts] = useState<Cert[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsMd(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    setLocalOrder(null);
  }, [certs]);

  useEffect(() => {
    setHiddenCertIds((prev) =>
      prev.filter(
        (id) =>
          certs.some((c) => c.id === id) ||
          localDraftCerts.some((c) => c.id === id),
      ),
    );
  }, [certs, localDraftCerts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const hideCertOptimistic = useCallback((id: string) => {
    setHiddenCertIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const unhideCert = useCallback((id: string) => {
    setHiddenCertIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const removeLocalDraft = useCallback((id: string) => {
    setLocalDraftCerts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const allCerts = useMemo(
    () => [...certs, ...localDraftCerts],
    [certs, localDraftCerts],
  );

  const visibleCertsBase = useMemo(
    () => allCerts.filter((c) => !hiddenCertIds.includes(c.id)),
    [allCerts, hiddenCertIds],
  );

  const defaultOrder = useMemo(
    () => visibleCertsBase.map((c) => c.id),
    [visibleCertsBase],
  );

  const effectiveOrder = localOrder ?? defaultOrder;

  const orderedVisible = useMemo(() => {
    return effectiveOrder
      .map((id) => visibleCertsBase.find((c) => c.id === id))
      .filter((c): c is Cert => c != null);
  }, [effectiveOrder, visibleCertsBase]);

  const sortableIdsOrdered = useMemo(
    () => orderedVisible.filter((c) => persisted.has(c.id)).map((c) => c.id),
    [orderedVisible, persisted],
  );

  const enableDnd =
    adminEditable && sortableIdsOrdered.length >= 2;

  const dragSuspended = editingCertId !== null || formBusy;

  const editingCert = useMemo(
    () =>
      editingCertId
        ? allCerts.find((c) => c.id === editingCertId) ?? null
        : null,
    [allCerts, editingCertId],
  );

  const persistReorder = useCallback(
    async (visibleOrder: string[]) => {
      const visiblePersisted = visibleOrder.filter((id) => persisted.has(id));
      const hiddenTail = certs
        .filter((c) => hiddenCertIds.includes(c.id))
        .map((c) => c.id);
      const fullOrder = [...visiblePersisted, ...hiddenTail];
      if (fullOrder.length !== certs.length) {
        setLocalOrder(null);
        window.alert("순서 데이터가 올바르지 않습니다.");
        return;
      }
      try {
        const res = await fetch("/api/admin/certs/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderedIds: fullOrder }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setLocalOrder(null);
          window.alert(data.error ?? "순서 저장에 실패했습니다.");
          return;
        }
        router.refresh();
      } catch {
        setLocalOrder(null);
        window.alert("네트워크 오류가 발생했습니다.");
      }
    },
    [certs, hiddenCertIds, persisted, router],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const activeId = String(active.id);
      const overId = String(over.id);
      const oldIndex = sortableIdsOrdered.indexOf(activeId);
      const newIndex = sortableIdsOrdered.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const nextSortable = arrayMove(sortableIdsOrdered, oldIndex, newIndex);
      const queue = [...nextSortable];
      const newVisible = effectiveOrder.map((id) => {
        if (persisted.has(id)) {
          const n = queue.shift();
          return n ?? id;
        }
        return id;
      });
      setLocalOrder(newVisible);
      void persistReorder(newVisible);
    },
    [effectiveOrder, persistReorder, persisted, sortableIdsOrdered],
  );

  const handleCreateCert = useCallback(() => {
    if (editingCertId !== null || formBusy) return;
    const id = `draft-${crypto.randomUUID().replace(/-/g, "")}`;
    const draft: Cert = {
      id,
      title: "새 자격증",
      issuer: "발행처",
      issuedAt: "Jan 2026",
      url: null,
      hasPublicLink: false,
      avatarText: "한",
      avatarVariant: "han",
    };
    setLocalDraftCerts((prev) => [...prev, draft]);
    setEditingCertId(id);
    setBatchMode(true);
  }, [editingCertId, formBusy]);

  const closeEditor = useCallback(() => {
    if (!editingCertId) return;
    if (!persisted.has(editingCertId)) {
      removeLocalDraft(editingCertId);
    }
    setEditingCertId(null);
  }, [editingCertId, persisted, removeLocalDraft]);

  const saveCert = useCallback(
    async (payload: CertEditPayload) => {
      if (!editingCertId) return;
      setFormBusy(true);
      try {
        const isNew = !persisted.has(editingCertId);
        const res = await fetch(
          isNew
            ? "/api/admin/certs"
            : `/api/admin/certs/${encodeURIComponent(editingCertId)}`,
          {
            method: isNew ? "POST" : "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: payload.title,
              issuer: payload.issuer,
              issuedAtLabel: payload.issuedAtLabel,
              url: payload.url,
            }),
          },
        );
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          window.alert(data.error ?? "저장에 실패했습니다.");
          return;
        }
        const savedDraftId = editingCertId;
        await router.refresh();
        if (isNew) removeLocalDraft(savedDraftId);
        setEditingCertId(null);
      } catch {
        window.alert("네트워크 오류가 발생했습니다.");
      } finally {
        setFormBusy(false);
      }
    },
    [editingCertId, persisted, removeLocalDraft, router],
  );

  const deleteCert = useCallback(
    async (id: string, title: string) => {
      if (!window.confirm(`「${title}」항목을 삭제할까요?`)) return;
      if (!persisted.has(id)) {
        removeLocalDraft(id);
        if (editingCertId === id) setEditingCertId(null);
        return;
      }
      try {
        const res = await fetch(`/api/admin/certs/${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          window.alert(data.error ?? "삭제에 실패했습니다.");
          return;
        }
        if (editingCertId === id) setEditingCertId(null);
        router.refresh();
      } catch {
        window.alert("네트워크 오류가 발생했습니다.");
      }
    },
    [editingCertId, persisted, removeLocalDraft, router],
  );

  const toggleBatchMode = useCallback(() => {
    if (batchMode) {
      if (editingCertId && !persisted.has(editingCertId)) {
        removeLocalDraft(editingCertId);
      }
      setEditingCertId(null);
      setBatchMode(false);
    } else {
      setBatchMode(true);
    }
  }, [batchMode, editingCertId, persisted, removeLocalDraft]);

  const ulClass =
    "grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 md:items-stretch lg:grid-cols-3";

  const addIdx = orderedVisible.length;

  function renderCertBlock(cert: Cert, i: number) {
    const canDb = persisted.has(cert.id);
    const editingThis = editingCertId === cert.id;
    const showInlineForm = editingThis && !isMd;
    const showCard = !showInlineForm;

    const inner = (
      <div className="relative h-full w-full min-h-0">
        {batchMode && canDb && !editingThis ? (
          <div className="pointer-events-auto absolute right-2 top-2 z-[25] flex gap-1">
            <button
              type="button"
              className={miniCardActionBtn}
              onClick={() => setEditingCertId(cert.id)}
              disabled={formBusy}
              aria-label={`${cert.title} 수정`}
              title="수정"
            >
              <AiOutlineEdit className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              className={miniCardActionBtn}
              onClick={() => void deleteCert(cert.id, cert.title)}
              disabled={formBusy}
              aria-label={`${cert.title} 삭제`}
              title="삭제"
            >
              <AiOutlineDelete className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
        <Reveal
          delayMs={i * 80 + 240}
          threshold={0.25}
          className="h-full w-full min-h-0"
        >
          {showInlineForm ? (
            <CertEditForm
              cert={cert}
              variant="inline"
              busy={formBusy}
              useCreatePostSkeleton={!canDb}
              onCancel={() => void closeEditor()}
              onSave={(p) => saveCert(p)}
            />
          ) : showCard ? (
            <CertCard
              cert={cert}
              hideLinkChip={batchMode}
              showDraftChip={!canDb}
            />
          ) : null}
        </Reveal>
      </div>
    );

    if (enableDnd && canDb) {
      return (
        <CertsSectionSortableItem
          key={cert.id}
          id={cert.id}
          dragDisabled={dragSuspended}
        >
          {inner}
        </CertsSectionSortableItem>
      );
    }

    return (
      <li key={cert.id} className="md:flex md:h-full md:min-h-0">
        {inner}
      </li>
    );
  }

  const listItems = orderedVisible.map((cert, i) => renderCertBlock(cert, i));

  const ghostSlots =
    adminEditable ? (
      <>
        <li className="w-full min-w-0 md:hidden">
          <Reveal
            delayMs={addIdx * 80 + 240}
            threshold={0.25}
            className="h-full w-full min-w-0"
          >
            <AdminNewCertGhostMobile
              disabled={editingCertId !== null || formBusy}
              onClick={handleCreateCert}
            />
          </Reveal>
        </li>
        <li className="hidden w-full min-w-0 md:flex md:h-full md:min-h-0">
          <Reveal
            delayMs={addIdx * 80 + 240}
            threshold={0.25}
            className="h-full w-full min-w-0"
          >
            <AdminNewCertGhostDesktop
              disabled={editingCertId !== null || formBusy}
              onClick={handleCreateCert}
            />
          </Reveal>
        </li>
      </>
    ) : null;

  const listBody = (
    <>
      {listItems}
      {ghostSlots}
    </>
  );

  return (
    <>
      <SectionIntroHeader
        label={headerLabel}
        title={title}
        titleId={titleId}
        description={description}
      />

      <div
        className={
          adminEditable
            ? "mt-6 flex w-full flex-col gap-3"
            : "mt-12 w-full"
        }
      >
        {adminEditable ? (
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={toggleBatchMode}
              className={certsBulkEditPill}
              aria-label={batchMode ? "편집 완료" : "수료 및 자격 편집"}
              title={batchMode ? "편집 종료" : "편집"}
            >
              {batchMode ? "완료" : "수정"}
            </button>
          </div>
        ) : null}

        {enableDnd ? (
          <DndContext
            id="portfolio-certs-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortableIdsOrdered}
              strategy={rectSortingStrategy}
            >
              <ul className={ulClass}>{listBody}</ul>
            </SortableContext>
          </DndContext>
        ) : (
          <ul className={ulClass}>{listBody}</ul>
        )}
      </div>

      {editingCert && isMd ? (
        <AdminDismissibleModal
          open
          title={
            editingCert && !persisted.has(editingCert.id)
              ? "자격증 추가"
              : "자격증 수정"
          }
          onClose={() => closeEditor()}
        >
          <CertEditForm
            cert={editingCert}
            variant="modal"
            busy={formBusy}
            useCreatePostSkeleton={!persisted.has(editingCert.id)}
            onCancel={() => void closeEditor()}
            onSave={(p) => saveCert(p)}
          />
        </AdminDismissibleModal>
      ) : null}
    </>
  );
}
