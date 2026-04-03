import type { ContributionSummary } from "@/data/githubContributions";

const levelClass: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-zinc-100/90",
  1: "bg-sky-100/90",
  2: "bg-sky-200/85",
  3: "bg-sky-300/75",
  4: "bg-sky-400/65",
};

/** 최근 35일을 5열×7행(열=주 단위)으로 맞춤, 부족분은 0 레벨 패딩 */
function previewGrid(days: ContributionSummary["days"]): (0 | 1 | 2 | 3 | 4)[][] {
  const last = days.slice(-35);
  const padded: (0 | 1 | 2 | 3 | 4)[] = [];
  const padCount = 35 - last.length;
  for (let i = 0; i < padCount; i++) padded.push(0);
  for (const d of last) padded.push(d.level);
  const grid: (0 | 1 | 2 | 3 | 4)[][] = [];
  for (let r = 0; r < 7; r++) {
    const row: (0 | 1 | 2 | 3 | 4)[] = [];
    for (let c = 0; c < 5; c++) {
      row.push(padded[c * 7 + r] ?? 0);
    }
    grid.push(row);
  }
  return grid;
}

function fmt(n: number | null): string {
  if (n === null) return "—";
  return new Intl.NumberFormat("en-US").format(n);
}

type Props = {
  summary: ContributionSummary | null;
  username: string;
};

export default function GithubContributionCard({ summary, username }: Props) {
  const grid = previewGrid(summary?.days ?? []);
  const thisYear = summary?.thisYear ?? null;
  const today = summary?.today ?? null;
  const handle = username.replace(/^@/, "");

  return (
    <div className="mb-10 max-w-[20rem] rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-md shadow-zinc-200/40 backdrop-blur-sm md:mb-12 md:max-w-[22rem] md:p-6">
      <div className="flex gap-5 md:gap-6">
        {/* 줄 높이는 max(잔디, 오른쪽 콘텐츠). justify-end로 잔디를 아래 붙여 핸들(오른열 하단)과 한 줄에 맞춤 */}
        <div className="flex shrink-0 flex-col justify-end">
          <div
            className="grid w-fit grid-cols-5 grid-rows-7 gap-1 md:gap-1.5"
            aria-hidden
          >
            {grid.flatMap((row, r) =>
              row.map((level, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`size-[10px] rounded-[2px] md:size-4 md:rounded-sm ${levelClass[level]}`}
                />
              )),
            )}
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between text-left">
          <div className="pt-0.5">
            <p className="text-base font-bold leading-tight tracking-tight text-zinc-900 md:text-lg">
              This year{" "}
              <span className="tabular-nums">{fmt(thisYear)}</span>
            </p>
            <p className="mt-2.5 text-sm tabular-nums text-zinc-500 md:mt-3 md:text-[0.9375rem]">
              Today {fmt(today)}
            </p>
          </div>
          {handle ? (
            <p className="text-right">
              <a
                href={`https://github.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 transition-colors hover:text-zinc-600 md:text-[0.8125rem]"
              >
                @{handle}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
