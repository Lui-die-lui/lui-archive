"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { ctaPillGlassButtonHeader } from "@/components/ui/ctaPill";
import {
  adminBubbleClass,
  getGuestBubbleClass,
  guestBubblePalette,
  type GuestbookBubbleColor,
  type GuestbookEntry,
} from "@/data/guestbook";

function formatArchivedTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  initialEntries: GuestbookEntry[];
  /** DB `SiteSettings.guestbookSubmissionsOpen` */
  submissionsOpen: boolean;
  /** 서버에서 목록 조회 실패 시 */
  loadError?: string | null;
  /** 관리자 세션 — 말풍선은 DB `authorType`으로만 구분(닉네임과 무관) */
  isAdminSession?: boolean;
};

/** 로그 하단에서 이보다 멀면 "최근" FAB 표시 (px) */
const GUESTBOOK_BOTTOM_THRESHOLD_PX = 56;

/** 메시지 글자수 상한 */
const MAX_MESSAGE_CHARS = 200;

const MAX_NICKNAME_CHARS = 20;

/** 섹션 부제 옆 관리자 액션 — 모바일은 패딩·글자 축소로 한 줄·우측 정렬 유지 */
const gbActionPill =
  "inline-flex h-8 min-w-0 shrink-0 items-center justify-center rounded-full border border-zinc-200/85 bg-white px-2.5 text-[11px] font-semibold leading-none tracking-tight text-zinc-700 shadow-sm transition-[color,background-color,border-color,box-shadow] hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50 disabled:pointer-events-none disabled:opacity-45 sm:h-9 sm:min-w-[4.5rem] sm:px-4 sm:text-xs md:px-5";

const gbDangerPill =
  "inline-flex h-8 min-w-0 shrink-0 items-center justify-center rounded-full border border-rose-200/80 bg-white px-2.5 text-[11px] font-semibold leading-none tracking-tight text-rose-800 shadow-sm transition-[color,background-color,border-color,box-shadow] hover:border-rose-300 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400/45 disabled:pointer-events-none disabled:opacity-45 sm:h-9 sm:min-w-[4.5rem] sm:px-4 sm:text-xs md:px-5";

const gbGhostPill =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-transparent px-2 text-[11px] font-semibold leading-none tracking-tight text-zinc-500 transition-colors hover:bg-zinc-100/80 hover:text-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50 disabled:pointer-events-none disabled:opacity-45 sm:h-9 sm:px-3.5 sm:text-xs";

export default function GuestbookPanel({
  initialEntries,
  submissionsOpen,
  loadError = null,
  isAdminSession = false,
}: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] =
    useState<GuestbookBubbleColor>("sky");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  const logRef = useRef<HTMLDivElement | null>(null);
  const logContentRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollToBottomRef = useRef(false);
  const [showScrollToRecent, setShowScrollToRecent] = useState(false);

  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [entries],
  );

  const updateScrollToRecentVisibility = useCallback(() => {
    const el = logRef.current;
    if (!el || sorted.length === 0) {
      setShowScrollToRecent(false);
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollToRecent(distFromBottom > GUESTBOOK_BOTTOM_THRESHOLD_PX);
  }, [sorted.length]);

  useEffect(() => {
    const el = logRef.current;
    const inner = logContentRef.current;
    if (!el) return;

    const tick = () => updateScrollToRecentVisibility();
    el.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);

    const ro = new ResizeObserver(tick);
    ro.observe(el);
    if (inner) ro.observe(inner);

    tick();
    return () => {
      el.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      ro.disconnect();
    };
  }, [updateScrollToRecentVisibility, sorted.length]);

  function scrollLogToRecent() {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  const formDisabled =
    Boolean(loadError) ||
    submitting ||
    (!isAdminSession && !submissionsOpen);

  function exitDeleteMode() {
    setDeleteMode(false);
    setSelectedIds([]);
  }

  function toggleEntrySelected(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function deleteSelectedEntries() {
    if (selectedIds.length === 0) {
      window.alert("삭제할 항목을 선택해 주세요.");
      return;
    }
    if (
      !window.confirm(
        `선택한 ${selectedIds.length}개의 방명록을 삭제할까요?`,
      )
    ) {
      return;
    }
    setDeleteBusy(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        window.alert(data.error ?? "삭제하지 못했습니다.");
        return;
      }
      const remove = new Set(selectedIds);
      setEntries((prev) => prev.filter((e) => !remove.has(e.id)));
      exitDeleteMode();
    } catch {
      window.alert("네트워크 오류가 발생했습니다.");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function deleteAllEntries() {
    if (
      !window.confirm(
        "모든 방명록을 삭제할까요? 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      return;
    }
    setDeleteBusy(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ deleteAll: true }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        window.alert(data.error ?? "삭제하지 못했습니다.");
        return;
      }
      setEntries([]);
      exitDeleteMode();
    } catch {
      window.alert("네트워크 오류가 발생했습니다.");
    } finally {
      setDeleteBusy(false);
    }
  }

  function handleMessageKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    if (e.shiftKey) return;
    if (formDisabled || !message.trim()) return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loadError || submitting) return;
    if (!isAdminSession && !submissionsOpen) return;

    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(
          isAdminSession
            ? { message: trimmedMsg }
            : {
                nickname:
                  nickname.trim().slice(0, MAX_NICKNAME_CHARS) || "guest",
                message: trimmedMsg,
                bubbleColor: selectedColor,
              },
        ),
      });

      const data = (await res.json()) as {
        entry?: GuestbookEntry;
        error?: string;
      };

      if (!res.ok) {
        setSubmitError(data.error ?? "저장하지 못했습니다.");
        return;
      }

      if (!data.entry) {
        setSubmitError("응답 형식이 올바르지 않습니다.");
        return;
      }

      setEntries((prev) => [...prev, data.entry!]);
      setMessage("");
      pendingScrollToBottomRef.current = true;
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  // 새 항목이 추가되면(=채팅처럼) 하단으로 자동 스크롤
  useEffect(() => {
    if (!pendingScrollToBottomRef.current) return;
    const el = logRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    pendingScrollToBottomRef.current = false;
    requestAnimationFrame(() => updateScrollToRecentVisibility());
  }, [entries.length, updateScrollToRecentVisibility]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 md:gap-5">
      <div className="w-full shrink-0">
        <div className="flex w-full items-baseline gap-0">
          <p className="shrink-0 text-[0.65rem] font-medium uppercase leading-none tracking-[0.22em] text-zinc-400 md:text-[0.58rem] md:tracking-[0.2em]">
            GUESTBOOK
          </p>
          <span
            className="relative -top-px ml-1 h-px min-w-0 flex-1 bg-zinc-200/80"
            aria-hidden
          />
        </div>
        <h1
          id="guestbook-heading"
          className="mt-3 text-base font-semibold leading-tight tracking-tight text-zinc-900 md:text-[1.35rem] lg:text-[1.45rem]"
        >
          방명록
        </h1>
        <div className="mt-1 flex w-full min-w-0 items-center gap-2 sm:gap-x-3">
          <p className="min-w-0 flex-1 text-sm leading-snug text-zinc-500 md:max-w-xl md:text-[0.95rem]">
            방문한 흔적을 짧게 남겨주세요.
          </p>
          {isAdminSession ? (
            deleteMode ? (
              <div className="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
                <button
                  type="button"
                  className={gbActionPill}
                  disabled={deleteBusy}
                  onClick={() => void deleteSelectedEntries()}
                >
                  선택 삭제
                </button>
                <button
                  type="button"
                  className={gbDangerPill}
                  disabled={deleteBusy}
                  onClick={() => void deleteAllEntries()}
                >
                  일괄 삭제
                </button>
                <button
                  type="button"
                  className={gbGhostPill}
                  disabled={deleteBusy}
                  onClick={exitDeleteMode}
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="shrink-0">
                <button
                  type="button"
                  className={gbActionPill}
                  onClick={() => setDeleteMode(true)}
                >
                  삭제
                </button>
              </div>
            )
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col rounded-2xl border border-white/45 bg-white/[0.22] shadow-[0_8px_40px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150">
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
        {loadError ? (
          <p
            className="rounded-xl border border-amber-200/60 bg-amber-50/80 px-3 py-2 text-sm text-amber-950"
            role="alert"
          >
            {loadError}
          </p>
        ) : null}
        {!submissionsOpen && !loadError && !isAdminSession ? (
          <p
            className="rounded-xl border border-zinc-200/70 bg-zinc-100/50 px-3 py-2 text-sm text-zinc-700"
            role="status"
          >
            지금은 새 방명록을 받지 않습니다.
          </p>
        ) : null}
        {!submissionsOpen && !loadError && isAdminSession ? (
          <p
            className="rounded-xl border border-sky-200/60 bg-sky-50/70 px-3 py-2 text-sm text-sky-950"
            role="status"
          >
            수신이 꺼진 상태입니다. 관리자 답글만 남길 수 있습니다.
          </p>
        ) : null}
        <div className="relative min-h-0 flex-1">
          <div
            className="no-scrollbar h-full min-h-0 overflow-y-auto rounded-xl border border-white/35 bg-white/[0.18] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg backdrop-saturate-150 sm:px-2.5 sm:py-4 md:px-3"
            role="log"
            aria-label="방명록 기록"
            ref={logRef}
          >
            <div
              ref={logContentRef}
              className="w-full space-y-3 sm:space-y-4"
            >
              {sorted.map((entry) => {
                const isAdmin = entry.authorType === "admin";
                const bubbleClass = isAdmin
                  ? adminBubbleClass
                  : getGuestBubbleClass(entry.bubbleColor);

                const bubble = (
                  <div
                    className={`max-w-[min(94%,26rem)] rounded-2xl px-3 py-2 text-[0.8125rem] leading-relaxed shadow-[0_2px_12px_rgba(15,23,42,0.06)] backdrop-blur-md backdrop-saturate-150 sm:max-w-[min(94%,28rem)] sm:px-3.5 sm:py-2.5 sm:text-sm md:max-w-[min(94%,30rem)] md:px-3 md:py-2 md:text-[0.8125rem] ${bubbleClass}`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-xs font-semibold tracking-tight opacity-90">
                        {entry.nickname}
                      </span>
                      <span
                        className="font-mono text-[10px] font-normal opacity-60"
                        title={entry.createdAt}
                      >
                        {formatArchivedTime(entry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap">
                      {entry.message}
                    </p>
                  </div>
                );

                return (
                  <div
                    key={entry.id}
                    className={`flex w-full items-start gap-2 ${
                      deleteMode && isAdminSession
                        ? ""
                        : isAdmin
                          ? "justify-start"
                          : "justify-end"
                    }`}
                  >
                    {deleteMode && isAdminSession ? (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(entry.id)}
                        onChange={() => toggleEntrySelected(entry.id)}
                        disabled={deleteBusy}
                        className="mt-2.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-sky-600 focus:ring-sky-400/40"
                        aria-label={`${entry.nickname} 방명록 선택`}
                      />
                    ) : null}
                    {deleteMode && isAdminSession ? (
                      <div
                        className={`flex min-w-0 flex-1 ${
                          isAdmin ? "justify-start" : "justify-end"
                        }`}
                      >
                        {bubble}
                      </div>
                    ) : (
                      bubble
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {showScrollToRecent ? (
            <button
              type="button"
              onClick={scrollLogToRecent}
              className={`pointer-events-auto absolute bottom-3 right-3 z-10 gap-1.5 motion-safe:active:scale-[0.98] sm:bottom-4 sm:right-4 sm:gap-2 ${ctaPillGlassButtonHeader} md:!px-3 lg:!px-3.5`}
              aria-label="최근 방명록으로 부드럽게 이동"
            >
             
              <span>최근</span>

              <IoArrowDown
                className="h-4 w-4 shrink-0 sm:h-[1rem] sm:w-[1rem]"
                aria-hidden
              />
            </button>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 rounded-[1.75rem] border border-sky-200/45 bg-white/[0.55] p-3.5 shadow-[0_10px_44px_rgba(56,119,182,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-[12px] backdrop-saturate-150 sm:p-4 md:p-5"
          aria-label={isAdminSession ? "관리자 답글" : "방명록 남기기"}
        >
          {submitError ? (
            <p
              className="mb-3 rounded-xl border border-rose-200/70 bg-rose-50/80 px-3 py-2 text-sm text-rose-950"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}
          <div className="flex flex-col gap-3">
            {!isAdminSession ? (
              <div
                className="flex items-center gap-3 rounded-full border border-sky-200/35 bg-white/[0.55] px-4 py-2"
                role="group"
                aria-label="BG Color"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                  BG Color
                </span>
                <div className="flex items-center gap-2">
                  {guestBubblePalette.map((opt) => {
                    const selected = selectedColor === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedColor(opt.id)}
                        title={opt.label}
                        aria-pressed={selected}
                        disabled={formDisabled}
                        className={`h-5 w-5 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-45 ${
                          selected
                            ? "border-sky-400/45 ring-1 ring-sky-200/70 ring-offset-1 ring-offset-white/80"
                            : "border-white/70"
                        } ${opt.swatchClass}`}
                      />
                    );
                  })}
                </div>
              </div>
            ) : null}

            {(() => {
              const messageChars = message.length;
              const canSubmit = message.trim().length > 0;
              return (
                <div className="rounded-[1.5rem] border border-sky-200/40 bg-white/[0.35] px-3.5 py-3 sm:px-4 sm:py-3.5">
                  {!isAdminSession ? (
                    <>
                      <label className="sr-only" htmlFor="gb-nickname">
                        닉네임
                      </label>
                      <input
                        id="gb-nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임 (선택)"
                        maxLength={MAX_NICKNAME_CHARS}
                        disabled={formDisabled}
                        className="w-full border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50"
                      />
                      <div
                        className="my-2.5 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent"
                        aria-hidden
                      />
                    </>
                  ) : null}
                  <label className="sr-only" htmlFor="gb-message">
                    메시지
                  </label>
                  <textarea
                    id="gb-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleMessageKeyDown}
                    placeholder={
                      isAdminSession
                        ? "관리자 답글을 입력하세요"
                        : "메시지를 남겨 주세요"
                    }
                    rows={isAdminSession ? 4 : 3}
                    maxLength={MAX_MESSAGE_CHARS}
                    disabled={formDisabled}
                    className={`w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50 ${
                      isAdminSession
                        ? "min-h-[5rem] sm:min-h-[5.25rem]"
                        : "min-h-[3.75rem] sm:min-h-[4rem]"
                    }`}
                  />

                  <div className="mt-2.5 flex items-end justify-between gap-3">
                    <p
                      className="select-none font-mono text-[10px] text-zinc-500"
                      aria-live="polite"
                    >
                      {messageChars} / {MAX_MESSAGE_CHARS}
                    </p>
                    <button
                      type="submit"
                      disabled={!canSubmit || formDisabled}
                      aria-label={isAdminSession ? "답글 보내기" : "기록 남기기"}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/[0.35] text-zinc-600 backdrop-blur-sm transition-colors hover:border-zinc-300/90 hover:bg-white/60 disabled:pointer-events-none disabled:opacity-45"
                    >
                      <IoArrowUp className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}
