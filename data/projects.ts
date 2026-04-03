export type Project = {
  id: string;
  title: string;
  summary: string;
  statusChips: string[];
  /**
   * 썸네일 URL (`next.config`의 `images.remotePatterns`에 등록된 호스트).
   * `null`이면 그라데이션+브라우저 프레임 플레이스홀더.
   */
  image: string | null;
  techTags: string[];
  readmeUrl: string;
  /** 없으면 LIVE 버튼 미표시 */
  liveUrl?: string;
};

/** Unsplash 소스 — 실제 배포 시 `/public/projects/…` 로 교체 가능 */
const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const projects: Project[] = [
  {
    id: "omijoy",
    title: "OMIJOY",
    summary:
      "공연 탐색, 저장, 공유를 연결한 공연·공연장 통합 플랫폼",
    statusChips: ["Team"],
    image: u("photo-1470229722913-7c0e2dbbafd3"),
    techTags: ["React", "Spring Boot", "Kopis API", "MariaDB"],
    readmeUrl: "#",
  },
  {
    id: "odyssey-plan",
    title: "ODYSSEY PLAN",
    summary:
      "AI 인터뷰를 바탕으로 5년 계획을 만들고 다듬는 개인 계획 설계 서비스",
    statusChips: ["Personal"],
    image: null,
    techTags: ["Next.js", "NextAuth", "Prisma", "Supabase", "OpenAI"],
    readmeUrl: "#",
    liveUrl: "#",
  },
  {
    id: "muzin",
    title: "MU:ZIN",
    summary:
      "아티스트 검색, 레슨, 예약 흐름을 설계 중인 음악 레슨 매칭 플랫폼",
    statusChips: ["Personal", "In Progress"],
    image: u("photo-1511379938547-c1f69419868d"),
    techTags: ["React", "Spring Boot", "QueryDSL", "PostgreSQL"],
    readmeUrl: "#",
  },
];
