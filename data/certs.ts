/** 원형 아바타 색조 (스크린샷 기준) */
export type CertAvatarVariant = "han" | "google" | "anthropic";

export type Cert = {
  id: string;
  title: string;
  issuer: string;
  /** 화면 표기용 날짜 (예: Mar 2026) */
  issuedAt: string;
  /** 있으면 카드 전체가 링크 */
  url: string | null;
  /** false면 타이틀 오른쪽에 「링크 없음」 표시 */
  hasPublicLink: boolean;
  /** 아바타 안 텍스트 (한 글자·이니셜) */
  avatarText: string;
  avatarVariant: CertAvatarVariant;
};

export const certs: Cert[] = [
  {
    id: "sqld",
    title: "SQLD",
    issuer: "한국데이터산업진흥원",
    issuedAt: "Mar 2026",
    url: null,
    hasPublicLink: false,
    avatarText: "한",
    avatarVariant: "han",
  },
  {
    id: "google-ai-essentials",
    title: "Google AI Essentials",
    issuer: "Google",
    issuedAt: "Dec 2025",
    url: "https://www.coursera.org/learn/google-ai-essentials",
    hasPublicLink: true,
    avatarText: "G",
    avatarVariant: "google",
  },
  {
    id: "claude-code-in-action",
    title: "Claude Code in Action",
    issuer: "Anthropic",
    issuedAt: "Mar 2026",
    url: "https://www.anthropic.com/learn",
    hasPublicLink: true,
    avatarText: "A",
    avatarVariant: "anthropic",
  },
  {
    id: "claude-101",
    title: "Claude 101",
    issuer: "Anthropic",
    issuedAt: "Apr 2026",
    url: "https://www.anthropic.com/learn",
    hasPublicLink: true,
    avatarText: "A",
    avatarVariant: "anthropic",
  },
  {
    id: "intro-claude-cowork",
    title: "Introduction to Claude Cowork",
    issuer: "Anthropic",
    issuedAt: "Apr 2026",
    url: "https://www.anthropic.com/learn",
    hasPublicLink: true,
    avatarText: "A",
    avatarVariant: "anthropic",
  },
];
