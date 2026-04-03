import type { Cert } from "@/data/certs";

const avatarVariantClass: Record<Cert["avatarVariant"], string> = {
  han: "bg-white text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,1)] ring-1 ring-zinc-200/90",
  google: "bg-sky-100 text-blue-800",
  anthropic: "bg-[#5B9BD5] text-zinc-900",
};

/**
 * 카드: `items-stretch`로 그리드 행 높이에 맞춘 뒤,
 * 아바타 열만 `items-center`로 원을 세로 중앙에 고정.
 * 본문 열은 `justify-center`로 제목·메타 블록 전체를 세로 중앙에 둠.
 */
const cardShell =
  "flex h-full w-full min-h-0 items-stretch gap-4 rounded-2xl border border-[#D7E4EE]/90 bg-[#F4F8FB]/95 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow,background-color] md:gap-4 md:p-4";

type Props = {
  cert: Cert;
};

export default function CertCard({ cert }: Props) {
  const avatar = (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold md:h-11 md:w-11 md:text-[0.8125rem] ${avatarVariantClass[cert.avatarVariant]}`}
      aria-hidden
    >
      <span
        className={
          cert.avatarVariant === "han"
            ? "text-[1.05rem] font-semibold leading-none md:text-[0.9375rem]"
            : "leading-none"
        }
      >
        {cert.avatarText}
      </span>
    </div>
  );

  const body = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
      <div className="flex items-center justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-base font-semibold leading-tight tracking-tight text-zinc-900 md:text-sm">
          {cert.title}
        </h3>
        {!cert.hasPublicLink ? (
          <span
            className="shrink-0 rounded-md border border-zinc-200/80 bg-white/60 px-2 py-0.5 text-[0.6875rem] font-medium text-zinc-400 md:text-[0.625rem]"
            title="공개 확인 링크 없음"
          >
            링크 없음
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm leading-snug text-zinc-500 md:mt-1 md:text-xs">
        {cert.issuer} · {cert.issuedAt}
      </p>
    </div>
  );

  if (cert.url) {
    return (
      <a
        href={cert.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardShell} hover:border-[#C5D4E2] hover:bg-[#EEF4F9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400/60`}
      >
        <div className="flex w-12 shrink-0 items-center justify-center self-stretch md:w-11">
          {avatar}
        </div>
        {body}
      </a>
    );
  }

  return (
    <div className={`${cardShell} cursor-default`}>
      <div className="flex w-12 shrink-0 items-center justify-center self-stretch md:w-11">
        {avatar}
      </div>
      {body}
    </div>
  );
}
