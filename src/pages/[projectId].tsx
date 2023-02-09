import type { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "../utils/api";

const ProjectPage: NextPage = () => {
  const router = useRouter()
  const projectId = router.query.projectId as string;
  const project = api.project.getProject.useQuery({ projectId  });

  return <div>
    <h1>Projekt</h1>
    <p>
      Projekt ID: {projectId}
      {project.isLoading ? "Loading..." : JSON.stringify(project.data)}
    </p>
  </div>
}

export default ProjectPage

