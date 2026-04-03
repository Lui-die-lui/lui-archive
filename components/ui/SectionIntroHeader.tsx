import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import type { ReactNode } from "react";

type SectionIntroHeaderProps = {
  label: string;
  title: string;
  titleId: string;
  description: string;
  /** 제목 옆 보조 UI (예: 관리자 수정 토글) */
  titleAction?: ReactNode;
};

/**
 * Skills / Projects / Certs 공통 — 라벨·제목·부제 간격·타이포·최대 너비 통일.
 */
export default function SectionIntroHeader({
  label,
  title,
  titleId,
  description,
  titleAction,
}: SectionIntroHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <Reveal delayMs={0}>
        <SectionLabel as="p" variant="intro" className="w-full text-center">
          {label}
        </SectionLabel>
      </Reveal>
      <Reveal delayMs={90}>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <h2
            id={titleId}
            className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl"
          >
            {title}
          </h2>
          {titleAction ? (
            <div className="flex shrink-0 items-center justify-center">
              {titleAction}
            </div>
          ) : null}
        </div>
      </Reveal>
      <Reveal delayMs={180}>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-zinc-600 md:text-base">
          {description}
        </p>
      </Reveal>
    </div>
  );
}
