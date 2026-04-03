import type { Project } from "@/data/projects";

export const MAX_BADGES = 2;
export const MAX_TECH_VISIBLE = 5;

type StatusChipToken = { bg: string; fg: string; bd: string };

const STATUS_CHIP_STYLES: Record<string, StatusChipToken> = {
  personal: {
    bg: "rgb(224, 245, 237)",
    fg: "rgba(0,120,80,1)",
    bd: "rgba(0,180,120,0.24)",
  },
  team: {
    bg: "rgb(237, 233, 255)",
    fg: "rgba(88, 56, 220, 1)",
    bd: "rgba(124, 92, 255, 0.28)",
  },
  "in progress": {
    bg: "rgb(255, 244, 224)",
    fg: "rgba(160,100,0,1)",
    bd: "rgba(255,170,0,0.28)",
  },
};

const STATUS_CHIP_FALLBACK: StatusChipToken = {
  bg: "rgb(244, 244, 245)",
  fg: "rgba(63, 63, 70, 1)",
  bd: "rgba(113, 113, 122, 0.24)",
};

function statusChipStyle(label: string): StatusChipToken {
  const key = label.trim().toLowerCase();
  return STATUS_CHIP_STYLES[key] ?? STATUS_CHIP_FALLBACK;
}

export function StatusChip({ label }: { label: string }) {
  const c = statusChipStyle(label);
  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
      style={{
        backgroundColor: c.bg,
        color: c.fg,
        borderColor: c.bd,
      }}
    >
      {label}
    </span>
  );
}

/** id 기반으로 고르는 부드러운 그라데이션(SSR·하이드레이션 일치). 채도 낮게 글라스 톤에 맞춤 */
const THUMB_GRADIENTS = [
  "from-slate-300/88 via-sky-200/72 to-blue-300/78",
  "from-violet-200/82 via-indigo-100/74 to-sky-200/76",
  "from-emerald-200/78 via-teal-100/72 to-cyan-200/74",
  "from-rose-200/80 via-orange-50/78 to-amber-200/72",
  "from-blue-200/82 via-slate-100/76 to-indigo-200/78",
  "from-fuchsia-200/74 via-violet-100/76 to-indigo-200/80",
  "from-cyan-200/78 via-sky-100/74 to-blue-200/76",
  "from-zinc-300/85 via-slate-200/78 to-zinc-400/72",
] as const;

function thumbGradientIndex(projectId: string) {
  let h = 0;
  for (let i = 0; i < projectId.length; i += 1) {
    h = (h * 31 + projectId.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % THUMB_GRADIENTS.length;
}

export function ThumbFallback({
  projectId,
  title,
}: {
  projectId: string;
  title: string;
}) {
  const g = THUMB_GRADIENTS[thumbGradientIndex(projectId)];
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${g}`}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/35 via-white/10 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[55%] w-[55%] rounded-full bg-white/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-[25%] -left-[15%] h-[45%] w-[45%] rounded-full bg-white/15 blur-2xl"
        aria-hidden
      />
      <p className="relative z-[1] max-w-[88%] text-balance rounded-2xl bg-zinc-800/48 px-4 py-3 text-center text-[0.6875rem] font-semibold uppercase leading-snug tracking-[0.1em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] md:text-xs md:tracking-[0.12em]">
        {title}
      </p>
    </div>
  );
}

export function ProjectCardBadgeList({ project }: { project: Project }) {
  const badges = project.statusChips.slice(0, MAX_BADGES);
  if (badges.length === 0) return null;
  return (
    <ul
      className="absolute right-2.5 top-2.5 z-[2] flex max-w-[78%] flex-wrap justify-end gap-1.5"
      aria-label="프로젝트 유형"
    >
      {badges.map((chip) => (
        <li key={chip}>
          <StatusChip label={chip} />
        </li>
      ))}
    </ul>
  );
}
