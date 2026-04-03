"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * 데스크톱용: 배경 클릭·Escape 로 닫힘. `open`이 false이면 렌더하지 않음.
 */
export default function AdminDismissibleModal({
  open,
  title,
  onClose,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className="relative z-[1] max-h-[min(90vh,36rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] md:p-6"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <h3
          id="admin-modal-title"
          className="text-base font-semibold tracking-tight text-zinc-900"
        >
          {title}
        </h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
