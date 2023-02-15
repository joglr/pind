import type { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { AddIcon } from "./icons";
import ProjectsList from "./ProjectsList";

const ViewProjects = ({
  projects,
  refetch,
}: {
  projects: Project[];
  refetch: () => void;
}) => {
  const session = useSession();
  const createProjectMutation = api.project.createProject.useMutation();

  async function createProject(evt: React.FormEvent<HTMLFormElement>) {
    if (!session.data?.user.id) return;
    await createProjectMutation.mutateAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-member-access
      name: evt.currentTarget.projectName.value!,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-member-access
      description: evt.currentTarget.description.value!,
      ownerId: session.data.user.id,
    });
    refetch();
  }

  return (
    <div>
      <h2 className="my-4 mx-1 text-4xl">Dine projekter</h2>
      {projects.length > 0 ? (
        <ProjectsList projects={projects} />
      ) : (
        <span className="m-1">Du har ikke tilføjet nogen projekter endnu</span>
      )}
      <h2 className="my-4 mx-1 text-4xl">Tiføj projekt</h2>
      <ul>
        <li>
          <form
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/20 p-4"
            onSubmit={(evt) => {
              evt.preventDefault();
              void createProject(evt);
            }}
          >
            <input
              className="border-b border-dashed  bg-transparent text-2xl font-bold"
              name="projectName"
              placeholder="Navn på projekt"
              disabled={createProjectMutation.isLoading}
            />
            <input
              className="border-b border-dashed  bg-transparent text-lg"
              name="description"
              placeholder="Beskrivelse"
              disabled={createProjectMutation.isLoading}
            />
            <button
              disabled={createProjectMutation.isLoading}
              className="flex flex-row justify-center rounded-full bg-white/20 px-4 py-2 font-semibold no-underline transition hover:bg-green-500/30"
            >
              <AddIcon className="mr-2" />
              <span>
                {createProjectMutation.isLoading
                  ? "Tilføj projekt..."
                  : "Tilføj projekt"}
              </span>
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
};

export default ViewProjects;
