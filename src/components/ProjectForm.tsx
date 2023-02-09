import { useSession } from "next-auth/react"
import { api } from "../utils/api"

const ProjectForm = () => {
  const session = useSession()
  const mut = api.project.createProject.useMutation()
  function createProject(evt: React.FormEvent<HTMLFormElement>) {
    const userId = session.data?.user.id
    if (!userId) return

    evt.preventDefault()
    const form = evt.target as HTMLFormElement
    const name = form.elements.namedItem("name") as HTMLInputElement
    mut.mutate({
      name: name.value,
      description: "test",
      ownerId: session.data.user.id
    })
  }
  return <div>
    <h2>Opret project</h2>
    <form onSubmit={createProject} >
      <label htmlFor="name">Navn
        <input type="text" name="name" id="name" />
      </label>
    </form>
  </div>
}

export default ProjectForm
