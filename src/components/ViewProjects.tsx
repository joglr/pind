import type { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../utils/api";

const ProjectList = ({
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
      <h2 className="my-4 mx-1 text-4xl text-white">Mine projekter</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((project) => {
          return (
            <li key={project.id}>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href={`/${project.id}`}
              >
                <h3 className="text-2xl font-bold">{project.name} →</h3>
                <div className="text-lg">{project.description}</div>
                <div className="flex">
                  <div className="m-1">
                    <div>{project.pindCount}</div>
                    <span>Pinde</span>
                  </div>
                  <div className="m-1">
                    <div>{project.omgangCount}</div>
                    <span>Omgange</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <h2 className="my-4 mx-1 text-4xl text-white">Tiføj projekt</h2>
      <ul>
        <li>
          <form
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white"
            onSubmit={(evt) => {
              evt.preventDefault();
              void createProject(evt);
            }}
          >
            <input
              className="border-b border-dashed  bg-transparent text-2xl font-bold text-white"
              name="projectName"
              placeholder="Navn på projekt"
              disabled={createProjectMutation.isLoading}
            />
            <input
              className="border-b border-dashed  bg-transparent text-lg text-white"
              name="description"
              placeholder="Beskrivelse"
              disabled={createProjectMutation.isLoading}
            />
            <button
              disabled={createProjectMutation.isLoading}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-green-500/20"
            >
              {createProjectMutation.isLoading
                ? "Tilføj projekt..."
                : "Tilføj projekt"}
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
};

export default ProjectList;
