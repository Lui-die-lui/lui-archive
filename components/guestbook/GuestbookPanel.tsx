"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { IoArrowUp } from "react-icons/io5";
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
};

/** 메시지 글자수 상한 */
const MAX_MESSAGE_CHARS = 200;

const MAX_NICKNAME_CHARS = 20;

export default function GuestbookPanel({ initialEntries }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] =
    useState<GuestbookBubbleColor>("sky");

  const logRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollToBottomRef = useRef(false);

  const sorted = useMemo(
    () =>
      [...entries].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [entries],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedNick =
      nickname.trim().slice(0, MAX_NICKNAME_CHARS) || "guest";
    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;

    const next: GuestbookEntry = {
      id: `gb-local-${Date.now()}`,
      authorType: "guest",
      nickname: trimmedNick,
      message: trimmedMsg,
      bubbleColor: selectedColor,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, next]);
    setMessage("");
    pendingScrollToBottomRef.current = true;
  }

  // 새 항목이 추가되면(=채팅처럼) 하단으로 자동 스크롤
  useEffect(() => {
    if (!pendingScrollToBottomRef.current) return;
    const el = logRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    pendingScrollToBottomRef.current = false;
  }, [entries.length]);

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col rounded-2xl border border-white/45 bg-white/[0.22] shadow-[0_8px_40px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150">
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
        <div className="relative min-h-0 flex-1">
          <div
            className="no-scrollbar h-full min-h-0 overflow-y-auto rounded-xl border border-white/35 bg-white/[0.18] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-lg backdrop-saturate-150 sm:px-4 sm:py-4"
            role="log"
            aria-label="방명록 기록"
            ref={logRef}
          >
            <div className="mx-auto w-full max-w-[30rem] space-y-3 sm:space-y-4">
              {sorted.map((entry) => {
                const isAdmin = entry.authorType === "admin";
                const bubbleClass = isAdmin
                  ? adminBubbleClass
                  : getGuestBubbleClass(entry.bubbleColor);

                return (
                  <div
                    key={entry.id}
                    className={`flex w-full ${
                      isAdmin ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3 py-2 text-[0.8125rem] leading-relaxed shadow-[0_2px_12px_rgba(15,23,42,0.06)] backdrop-blur-md backdrop-saturate-150 sm:max-w-[min(100%,20rem)] sm:px-3.5 sm:py-2.5 sm:text-sm md:max-w-[22rem] md:px-3 md:py-2 md:text-[0.8125rem] ${bubbleClass}`}
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 rounded-[1.75rem] border border-sky-200/45 bg-white/[0.55] p-3.5 shadow-[0_10px_44px_rgba(56,119,182,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-[12px] backdrop-saturate-150 sm:p-4 md:p-5"
          aria-label="방명록 남기기"
        >
          <div className="flex flex-col gap-3">
            {/* BG Color pill */}
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
                      className={`h-5 w-5 rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        selected
                          ? "border-sky-400/45 ring-1 ring-sky-200/70 ring-offset-1 ring-offset-white/80"
                          : "border-white/70"
                      } ${opt.swatchClass}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Big glass input */}
            {(() => {
              const messageChars = message.length;
              const canSubmit = message.trim().length > 0;
              return (
                <>
                  <div className="rounded-[1.5rem] border border-sky-200/40 bg-white/[0.35] px-3.5 py-3 sm:px-4 sm:py-3.5">
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
                      className="w-full border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
                    />
                    <div
                      className="my-2.5 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent"
                      aria-hidden
                    />
                    <label className="sr-only" htmlFor="gb-message">
                      메시지
                    </label>
                    <textarea
                      id="gb-message"
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      placeholder="메시지를 남겨 주세요"
                      rows={3}
                      maxLength={MAX_MESSAGE_CHARS}
                      className="min-h-[3.75rem] w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 sm:min-h-[4rem]"
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
                        disabled={!canSubmit}
                        aria-label="기록 남기기"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/[0.35] text-zinc-600 backdrop-blur-sm transition-colors hover:border-zinc-300/90 hover:bg-white/60 disabled:pointer-events-none disabled:opacity-45"
                      >
                        <IoArrowUp className="h-5 w-5" aria-hidden />
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </form>
      </div>
    </div>
  );
}
