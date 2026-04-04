/**
 * 방명록·github/velog: `ctaPillSize` (h-8). 히어로 contact는 모바일 `ctaPillSizeHeroRow`(h-9), md+는 상단 소셜보다 한 단계 큼(h-11 등).
 * 글라스 스킨은 `ctaPillGlass` (모바일 캐러셀 화살표는 `ctaPillGlassIconButton`).
 */
export const ctaPillSize =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-full px-3 text-[0.6875rem] font-medium leading-none md:px-3 md:text-[0.6875rem]";

export const ctaPillSizeLg =
  "inline-flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-[0.875rem] font-medium leading-none md:h-10 md:px-5 md:text-[0.8125rem]";

/** 히어로 버튼 행 모바일 — sm·lg 중간 (h-9, 글자 살짝 큼) */
const ctaPillSizeHeroRow =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-[0.75rem] font-medium leading-none";

/** 히어로 Contact: 모바일 `ctaPillSizeHeroRow`, md+ 웹에서 강조(h·패딩·타이포 상향) */
const ctaPillSizeHeroContact = `${ctaPillSizeHeroRow} md:h-11 md:px-6 md:text-[0.875rem]`;

/** 밝은 글라스 면(호버 없음) — 방명록·아이콘·Contact 기본 */
const ctaPillGlassSurface =
  "border border-white/45 bg-white/[0.28] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(15,23,42,0.05)] backdrop-blur-md backdrop-saturate-150 transition-[background-color,border-color,color,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400/50";

const ctaPillGlassHoverLight =
  "hover:border-white/55 hover:bg-white/[0.38] hover:text-zinc-900 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_8px_rgba(15,23,42,0.06)]";

/** 히어로 Contact 전용 — 호버 #7AAEDE, inset+바깥 그림자 구조 유지(호버 해제 시 잔선·깜빡임 방지) */
const ctaPillGlassHoverDarkContact =
  "hover:border-transparent hover:bg-[#7AAEDE]/92 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_1px_3px_rgba(40,100,160,0.14)]";

export const ctaPillGlass = `${ctaPillGlassSurface} ${ctaPillGlassHoverLight}`;

/** 방명록 */
export const ctaPillGlassButton = `${ctaPillSize} ${ctaPillGlass}`;

/** 사이트 헤더 방명록 — `ctaPillGlassButton`은 히어로 소셜과 공유되므로 웹에서만 한 단계 확대 */
export const ctaPillGlassButtonHeader = `${ctaPillGlassButton} md:h-9 md:px-4 md:text-[0.8125rem] lg:h-10 lg:px-5 lg:text-[0.875rem]`;

/** 히어로 contact (#footer) — GitHub/Velog 글라스와 동일 `duration-300 ease-out` */
export const ctaPillGlassContactButton = `${ctaPillSizeHeroContact} ${ctaPillGlassSurface} ${ctaPillGlassHoverDarkContact} duration-300 ease-out`;

/** 원형 아이콘 — 방명록·Contact와 동일 글라스 스킨 (캐러셀 화살표 등) */
export const ctaPillGlassIconButton = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus:outline-none ${ctaPillGlass} disabled:pointer-events-none disabled:opacity-35`;

/** 캐러셀 등 보조 UI용 소형 원형 (동일 스킨) */
export const ctaPillGlassIconButtonSm = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus:outline-none ${ctaPillGlass} disabled:pointer-events-none disabled:opacity-35`;

export const ctaPillSocialBase =
  `${ctaPillSize} tracking-wide text-white antialiased bg-zinc-950 shadow-sm transition-[background-color,box-shadow] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400`;

/** 히어로 Contact와 동일 캡슐 크기의 소셜 버튼(모바일 등) */
export const ctaPillSocialLg =
  `${ctaPillSizeLg} tracking-wide text-white antialiased bg-zinc-950 shadow-sm transition-[background-color,box-shadow] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400`;

/** 호버는 `HeroSection`에서 브랜드 틴트로 지정. 보더 없음·그림자는 최소만 */
const socialGlassEffects =
  "border-0 bg-zinc-900/38 text-zinc-100 shadow-[0_1px_3px_rgba(15,23,42,0.07)] backdrop-blur-lg backdrop-saturate-150 transition-[background-color,box-shadow,color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400/50";

/** GitHub / Velog — 살짝 어두운 톤의 글라스(과한 불투명 대신 blur + 얕은 짙은 베이스) */
export const ctaPillSocialGlassBase = `${ctaPillSize} tracking-wide antialiased ${socialGlassEffects}`;

/** 히어로 모바일 한 줄(Contact 옆) — `ctaPillSizeHeroRow`와 동일 크기 */
export const ctaPillSocialGlassHeroRow = `${ctaPillSizeHeroRow} tracking-wide antialiased ${socialGlassEffects}`;

export const ctaPillSocialGlassLg = `${ctaPillSizeLg} tracking-wide antialiased ${socialGlassEffects}`;

/** 프로젝트 카드 링크 공통 — 태그(#D7E4EE·#F4F8FB·#5E7486)와 같은 슬레이트 블루 계열, 호버는 한 톤만 */
const projectCardCtaBase =
  "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-[border-color,background-color,color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400/40";

/** README — 밝은 면, 얇은 보더 */
export const projectCardReadmeLink =
  `${projectCardCtaBase} border border-[#D6E0EA]/95 bg-white/95 text-[#5c6a78] hover:border-[#CCD8E4] hover:bg-[#FAFCFD] hover:text-[#4a5662]`;

/** LIVE — 살짝만 채운 배경으로만 구분, 채도 높은 색·글라스 대비 호버 없음 */
export const projectCardLiveLink =
  `${projectCardCtaBase} border border-[#CEDAE5] bg-[#F4F8FB]/98 text-[#546575] hover:border-[#C4D1DE] hover:bg-[#EEF3F8] hover:text-[#4a5866]`;
