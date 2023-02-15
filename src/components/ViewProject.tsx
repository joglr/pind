import type { Project } from "@prisma/client";
import { useMemo } from "react";
import { api } from "../utils/api";
import { PlusIcon, MinusIcon, ArchiveIcon } from "./icons";

export const ProjectView = ({ project }: { project: Project }) => {
  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4">
      {/* <h2 className="my-4 mx-1 text-4xl">Projekter</h2> */}

      <h3 className="text-2xl font-bold">{project.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        <Counter project={project} target="Pind" label="Pinde" />
        <Counter project={project} target="Omgang" label="Omgange" />
      </div>
      <p className="text-lg">{project.description}</p>
      <button>
        <ArchiveIcon />
        Slet projekt
      </button>
    </div>
  );
};

function Counter({
  project,
  target,
  label,
}: {
  project: Project;
  target: "Pind" | "Omgang";
  label: string;
}) {
  const targetKey = useMemo(
    () => `${target.toLowerCase() as "pind" | "omgang"}Count` as const,
    [target]
  );

  return (
    <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-2">
      <div>{project[targetKey]}</div>
      <span className="text-white/60">{label}</span>
      <CounterButton
        value={project[targetKey]}
        target={target}
        projectId={project.id}
        type="increase"
      />
      <CounterButton
        value={project[targetKey]}
        target={target}
        projectId={project.id}
        type="decrease"
      />
    </div>
  );
}

function CounterButton({
  value,
  type,
  target,
  projectId,
}: {
  value: number;
  type: "increase" | "decrease";
  target: "Pind" | "Omgang";
  projectId: string;
}) {
  const ctx = api.useContext();
  const mutation = api.project[`${type}${target}Count`].useMutation({
    onSuccess: async () => {
      await ctx.project.invalidate();
    },
  });

  const disabled = type === "decrease" && value < 1;

  return (
    <button
      className={`mx-2 grid h-10 w-10 place-items-center rounded text-2xl font-bold  ${
        disabled
          ? "cursor-default bg-purple-200/5"
          : "bg-purple-200/20 hover:bg-white/30"
      }`}
      onClick={() =>
        void mutation.mutateAsync({
          projectId,
        })
      }
      disabled={disabled}
    >
      {type === "increase" ? <PlusIcon /> : <MinusIcon />}
    </button>
  );
}
