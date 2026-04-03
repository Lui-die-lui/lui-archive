import {
  CertAvatarVariant,
  GuestbookAuthorType,
  GuestbookBubbleColor,
  PrismaClient,
  ProjectKindTag,
  SkillCategorySlug,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, guestbookSubmissionsOpen: true },
    update: {},
  });

  const skills: {
    slug: SkillCategorySlug;
    techStack: string;
    description: string;
  }[] = [
    {
      slug: SkillCategorySlug.FRONTEND,
      techStack: "React · TypeScript · Next.js · Emotion/Tailwind CSS",
      description:
        "사용자 경험과 인터랙션을 자연스럽게 연결하는 환경을 구성합니다.",
    },
    {
      slug: SkillCategorySlug.BACKEND,
      techStack: "Java · Spring Boot · JPA · QueryDSL · PostgreSQL",
      description:
        "유연하고 높은 처리량의 API와 데이터 구조로 설계하고 구현합니다.",
    },
    {
      slug: SkillCategorySlug.DATA_STATE,
      techStack: "TanStack Query · Zustand · DTO/Response 설계",
      description: "서버 상태와 내 상태를 분리해 구조를 단순하게 유지합니다.",
    },
    {
      slug: SkillCategorySlug.BUILD_DEPLOY,
      techStack: "NextAuth(OAuth2) · Prisma · Supabase · Vercel · GitHub",
      description:
        "로그인, DB연동, 배포까지 실제 서비스 흐름으로 분석해 경험이 있습니다.",
    },
  ];

  for (const s of skills) {
    await prisma.skillCategoryContent.upsert({
      where: { slug: s.slug },
      create: s,
      update: { techStack: s.techStack, description: s.description },
    });
  }

  const u = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

  const projects: {
    publicId: string;
    title: string;
    summary: string;
    thumbnailUrl: string | null;
    readmeUrl: string;
    deployUrl: string | null;
    sortOrder: number;
    tags: ProjectKindTag[];
    tech: string[];
  }[] = [
    {
      publicId: "omijoy",
      title: "OMIJOY",
      summary:
        "공연 탐색, 저장, 공유를 연결한 공연·공연장 통합 플랫폼",
      thumbnailUrl: u("photo-1470229722913-7c0e2dbbafd3"),
      readmeUrl: "#",
      deployUrl: null,
      sortOrder: 0,
      tags: [ProjectKindTag.TEAM],
      tech: ["React", "Spring Boot", "Kopis API", "MariaDB"],
    },
    {
      publicId: "odyssey-plan",
      title: "ODYSSEY PLAN",
      summary:
        "AI 인터뷰를 바탕으로 5년 계획을 만들고 다듬는 개인 계획 설계 서비스",
      thumbnailUrl: null,
      readmeUrl: "#",
      deployUrl: "#",
      sortOrder: 1,
      tags: [ProjectKindTag.PERSONAL],
      tech: ["Next.js", "NextAuth", "Prisma", "Supabase", "OpenAI"],
    },
    {
      publicId: "muzin",
      title: "MU:ZIN",
      summary:
        "아티스트 검색, 레슨, 예약 흐름을 설계 중인 음악 레슨 매칭 플랫폼",
      thumbnailUrl: u("photo-1511379938547-c1f69419868d"),
      readmeUrl: "#",
      deployUrl: null,
      sortOrder: 2,
      tags: [ProjectKindTag.PERSONAL, ProjectKindTag.IN_PROGRESS],
      tech: ["React", "Spring Boot", "QueryDSL", "PostgreSQL"],
    },
  ];

  await prisma.project.deleteMany({});
  for (const p of projects) {
    await prisma.project.create({
      data: {
        publicId: p.publicId,
        title: p.title,
        summary: p.summary,
        thumbnailUrl: p.thumbnailUrl,
        readmeUrl: p.readmeUrl,
        deployUrl: p.deployUrl,
        sortOrder: p.sortOrder,
        techLines: {
          create: p.tech.map((label, i) => ({
            label,
            sortOrder: i,
          })),
        },
        tagLinks: {
          create: p.tags.map((tag) => ({ tag })),
        },
      },
    });
  }

  const certs: {
    title: string;
    issuer: string;
    issuedAtLabel: string;
    url: string | null;
    hasPublicLink: boolean;
    avatarText: string;
    avatarVariant: CertAvatarVariant;
    sortOrder: number;
  }[] = [
    {
      title: "SQLD",
      issuer: "한국데이터산업진흥원",
      issuedAtLabel: "Mar 2026",
      url: null,
      hasPublicLink: false,
      avatarText: "한",
      avatarVariant: CertAvatarVariant.HAN,
      sortOrder: 0,
    },
    {
      title: "Google AI Essentials",
      issuer: "Google",
      issuedAtLabel: "Dec 2025",
      url: "https://naver.me/G4dIhWaS",
      hasPublicLink: true,
      avatarText: "G",
      avatarVariant: CertAvatarVariant.GOOGLE,
      sortOrder: 1,
    },
    {
      title: "Claude Code in Action",
      issuer: "Anthropic",
      issuedAtLabel: "Mar 2026",
      url: "https://naver.me/x9VQGBDs",
      hasPublicLink: true,
      avatarText: "A",
      avatarVariant: CertAvatarVariant.ANTHROPIC,
      sortOrder: 2,
    },
    {
      title: "Claude 101",
      issuer: "Anthropic",
      issuedAtLabel: "Apr 2026",
      url: "https://naver.me/GfrZgCT6",
      hasPublicLink: true,
      avatarText: "A",
      avatarVariant: CertAvatarVariant.ANTHROPIC,
      sortOrder: 3,
    },
    {
      title: "Introduction to Claude Cowork",
      issuer: "Anthropic",
      issuedAtLabel: "Apr 2026",
      url: "https://naver.me/GsBlDPnn",
      hasPublicLink: true,
      avatarText: "A",
      avatarVariant: CertAvatarVariant.ANTHROPIC,
      sortOrder: 4,
    },
  ];

  await prisma.certification.deleteMany({});
  for (const c of certs) {
    await prisma.certification.create({ data: c });
  }

  await prisma.guestbookEntry.deleteMany({});
  await prisma.guestbookEntry.createMany({
    data: [
      {
        authorType: GuestbookAuthorType.ADMIN,
        nickname: "Lui",
        message:
          "방명록에 남겨 주신 글은 아카이브에 차곡차곡 쌓입니다. 스팸·광고성 내용은 정리될 수 있어요.",
        bubbleColor: null,
        createdAt: new Date("2026-03-01T01:00:00.000Z"),
      },
      {
        authorType: GuestbookAuthorType.GUEST,
        nickname: "dayvisitor",
        message: "깔끔한 구성이네요. 응원합니다!",
        bubbleColor: GuestbookBubbleColor.SKY,
        createdAt: new Date("2026-03-05T08:42:00.000Z"),
      },
      {
        authorType: GuestbookAuthorType.GUEST,
        nickname: "mute",
        message: "프로젝트 카드 스크롤이 모바일에서 보기 편했어요.",
        bubbleColor: GuestbookBubbleColor.MINT,
        createdAt: new Date("2026-03-12T11:15:00.000Z"),
      },
    ],
  });

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
