import ProjectsSectionClient from "@/components/sections/ProjectsSectionClient";
import SectionIntroHeader from "@/components/ui/SectionIntroHeader";
import { isAdminSession } from "@/lib/admin-auth";
import { getProjectsForHome } from "@/lib/projects-db";

export default async function ProjectsSection() {
  const { projects, persistedPublicIds } = await getProjectsForHome();
  const adminEditable = await isAdminSession();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-[#fafbfd]"
    >
      <div className="site-container py-24 md:py-28">
        <SectionIntroHeader
          label="Works"
          titleId="projects-heading"
          title="Projects"
          description="만들고 배우며 정리한 프로젝트입니다."
        />

        <ProjectsSectionClient
          projects={projects}
          persistedPublicIds={[...persistedPublicIds]}
          adminEditable={adminEditable}
        />
      </div>
    </section>
  );
}
