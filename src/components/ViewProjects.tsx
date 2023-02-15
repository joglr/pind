import type { Project } from "@prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { AddIcon } from "./icons";

const ViewProjects = ({
  projects,
  archivedProjects,
}: {
  projects: Project[];
  archivedProjects: Project[];
}) => {
  const ctx = api.useContext();
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
    await ctx.project.invalidate();
    evt.currentTarget.reset();
  }

  const isLoading = createProjectMutation.isLoading;
  return (
    <div>
      <h2 className="my-4 mx-1 text-4xl">Opret projekt</h2>
      <ul className="mb-16 grid grid-cols-1 place-items-stretch gap-4 sm:grid-cols-2">
        <li>
          <form
            className="flex h-full flex-col gap-4 rounded-xl bg-white/20 p-4"
            onSubmit={(evt) => {
              evt.preventDefault();
              if (isLoading) return;
              void createProject(evt);
            }}
          >
            <input
              className="border-b border-dashed  bg-transparent text-2xl font-bold"
              name="projectName"
              placeholder="Navn på projekt"
              disabled={isLoading}
            />
            <div className="grow">
              <input
                className="border-b border-dashed  bg-transparent text-lg"
                name="description"
                placeholder="Beskrivelse"
                disabled={createProjectMutation.isLoading}
              />
            </div>
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
      <h2 className="my-4 mx-1 text-4xl">Dine projekter</h2>
      <ul className="mb-16 grid grid-cols-1 place-items-stretch gap-4 sm:grid-cols-2">
        {projects.length > 0 ? (
          <ProjectsList projects={projects} />
        ) : (
          <span className="mx-2 italic">
            Du har ikke tilføjet nogle projekter
          </span>
        )}
      </ul>
      <h2 className="my-4 mx-1 text-4xl">Arkiverede projekter</h2>
      <ul className="mb-16 grid grid-cols-1 place-items-stretch gap-4 sm:grid-cols-2">
        {archivedProjects.length > 0 ? (
          <ProjectsList projects={archivedProjects} />
        ) : (
          <span className="mx-2 italic">
            Du har ikke nogle arkiverede projekter
          </span>
        )}
      </ul>
    </div>
  );
};

const ProjectsList = ({ projects }: { projects: Project[] }) => (
  <>
    {projects.map((project) => {
      return (
        <li key={project.id}>
          <Link
            className="max-w flex h-full flex-col gap-4 rounded-xl bg-white/20 p-4 hover:bg-white/30"
            href={`/${project.id}`}
          >
            <h3 className="text-2xl font-bold">{project.name} →</h3>
            <div className="grow text-lg">{project.description}</div>
            <div className="flex">
              <div className="m-1">
                <div className="text-gray-200">{project.pindCount}</div>
                <span className="text-gray-400">Pinde</span>
              </div>
              <div className="m-1">
                <div className="text-gray-200">{project.omgangCount}</div>
                <span className="text-gray-400">Omgange</span>
              </div>
            </div>
          </Link>
        </li>
      );
    })}
  </>
);

export default ViewProjects;
