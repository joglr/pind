import { useSession } from "next-auth/react";
import { api } from "../utils/api";


const ProjectList = () => {
  const session = useSession()
  const { data: projects, status } = api.project.getAllProjects.useQuery(undefined, {
    enabled: session.status === "authenticated"
  })
  return <div>
    <h1>Projektliste</h1>
    {status === "success" ? JSON.stringify(projects) : "Error: " + status}
  </div>
}

export default ProjectList
