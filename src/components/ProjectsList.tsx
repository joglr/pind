import type { Project } from "@prisma/client";
import Link from "next/link";

const ProjectsList = ({ projects }: { projects: Project[] }) => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {projects.map((project) => {
      return (
        <li key={project.id}>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
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
);

export default ProjectsList;
