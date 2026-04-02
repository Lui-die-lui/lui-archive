export type Project = {
  id: string;
  title: string;
  summary: string;
  statusChips: string[];
  /** 공개 이미지 경로. `null`이면 그라데이션 플레이스홀더 */
  image: string | null;
  techTags: string[];
  readmeUrl: string;
  /** 없으면 LIVE 버튼 미표시 */
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: "omijoy",
    title: "OMIJOY",
    summary:
      "공연 탐색, 저장, 공유를 연결한 공연·공연장 통합 플랫폼",
    statusChips: ["Team"],
    image: null,
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
    techTags: ["Next.js", "NextAuth", "Prisma", "Supabase"],
    readmeUrl: "#",
    liveUrl: "#",
  },
  {
    id: "muzin",
    title: "MU:ZIN",
    summary:
      "아티스트 검색, 레슨, 예약 흐름을 설계 중인 음악 레슨 매칭 플랫폼",
    statusChips: ["Personal", "In Progress"],
    image: null,
    techTags: ["React", "Spring Boot", "QueryDSL", "PostgreSQL"],
    readmeUrl: "#",
  },
];
