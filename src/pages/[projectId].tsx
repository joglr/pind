import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { ProjectView } from "../components/ViewProject";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { data: project, refetch } = api.project.getProject.useQuery({
    projectId,
  });

  return project ? (
    <ProjectView project={project} refetch={() => void refetch()} />
  ) : (
    <span className="text-white">Indlæser projekt...</span>
  );
};

export default ProjectPage;
