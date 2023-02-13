import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { ProjectView } from "../components/ViewProject";
import { createContext, useContext } from "react";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { data: project, refetch } = api.project.getProject.useQuery({
    projectId,
  });

  return project ? (
    <RefetchContext.Provider value={() => void refetch()}>
      <ProjectView project={project} />
    </RefetchContext.Provider>
  ) : (
    <span className="text-white">Indlæser projekt...</span>
  );
};

const RefetchContext = createContext<() => void>(() => {
  throw new Error("useRefetch can only be used within RefetchProvider");
});
export const useRefetch = () => useContext(RefetchContext);

export default ProjectPage;
