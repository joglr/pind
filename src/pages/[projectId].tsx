import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { ProjectView } from "../components/ViewProject";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const project = api.project.getProject.useQuery({ projectId });

  return project.data ? (
    <ProjectView project={project.data} />
  ) : (
    <span>Indlæser projekt...</span>
  );
};

export default ProjectPage;
