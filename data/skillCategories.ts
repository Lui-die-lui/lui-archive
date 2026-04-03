export type SkillCategory = {
  id: string;
  /** 카드 제목 앞 이모지(장식, `aria-hidden` 처리는 카드에서) */
  emoji: string;
  title: string;
  /** 기술 나열 ·(가운뎃점) 구분 */
  techStack: string;
  description: string;
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    emoji: "🖥️",
    title: "Frontend",
    techStack: "React · TypeScript · Next.js · Emotion/Tailwind CSS",
    description:
      "사용자 경험과 인터랙션을 자연스럽게 연결하는 환경을 구성합니다.",
  },
  {
    id: "backend",
    emoji: "⚙️",
    title: "Backend",
    techStack: "Java · Spring Boot · JPA · QueryDSL · PostgreSQL",
    description:
      "유연하고 높은 처리량의 API와 데이터 구조로 설계하고 구현합니다.",
  },
  {
    id: "data-state",
    emoji: "📦",
    title: "Data & State",
    techStack: "TanStack Query · Zustand · DTO/Response 설계",
    description: "서버 상태와 내 상태를 분리해 구조를 단순하게 유지합니다.",
  },
  {
    id: "build-deploy",
    emoji: "🚀",
    title: "Build & Deploy",
    techStack: "NextAuth(OAuth2) · Prisma · Supabase · Vercel · GitHub",
    description:
      "로그인, DB연동, 배포까지 실제 서비스 흐름으로 분석해 경험이 있습니다.",
  },
];
