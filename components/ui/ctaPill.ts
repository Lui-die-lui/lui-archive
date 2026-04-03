/**
 * 방명록·github/velog: `ctaPillSize` (h-8). 히어로 contact만 `ctaPillSizeLg` (h-10/md:h-11, 글자 더 큼).
 * 글라스 스킨은 `ctaPillGlass` (모바일 캐러셀 화살표는 `ctaPillGlassIconButton`).
 */
export const ctaPillSize =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-[0.6875rem] font-medium leading-none md:px-3.5 md:text-xs";

export const ctaPillSizeLg =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-[0.875rem] font-medium leading-none md:h-11 md:px-6 md:text-sm";

export const ctaPillGlass =
  "border border-white/45 bg-white/[0.28] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-md backdrop-saturate-150 transition-[background-color,border-color,color,box-shadow] hover:border-white/55 hover:bg-white/[0.38] hover:text-zinc-900 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_8px_rgba(15,23,42,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400/50";

/** 방명록 */
export const ctaPillGlassButton = `${ctaPillSize} ${ctaPillGlass}`;

/** 히어로 contact (방명록보다 한 단계 큼) */
export const ctaPillGlassContactButton = `${ctaPillSizeLg} ${ctaPillGlass}`;

/** 원형 아이콘 — 방명록·Contact와 동일 글라스 스킨 (캐러셀 화살표 등) */
export const ctaPillGlassIconButton = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus:outline-none ${ctaPillGlass} disabled:pointer-events-none disabled:opacity-35`;

/** 캐러셀 등 보조 UI용 소형 원형 (동일 스킨) */
export const ctaPillGlassIconButtonSm = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus:outline-none ${ctaPillGlass} disabled:pointer-events-none disabled:opacity-35`;

export const ctaPillSocialBase =
  `${ctaPillSize} lowercase tracking-wide text-white antialiased bg-zinc-950 shadow-sm transition-[background-color,box-shadow] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400`;
