export type SkillCategory = {
  id: string;
  title: string;
  description: string;
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "화면 구조와 인터랙션을 다듬어 사용 흐름이 자연스럽게 이어지도록 만듭니다.",
  },
  {
    id: "backend",
    title: "Backend",
    description: "요청과 데이터 흐름을 정리하고, 안정적으로 동작하는 서버 측 로직을 구성합니다.",
  },
  {
    id: "data-state",
    title: "Data & State",
    description: "상태와 데이터를 예측 가능하게 관리해 복잡해지는 지점을 줄입니다.",
  },
  {
    id: "build-deploy",
    title: "Build & Deploy",
    description: "빌드·배포 파이프라인을 단순하게 유지해 변경이 빠르게 반영되도록 합니다.",
  },
];
