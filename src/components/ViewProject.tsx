import type { Project } from "@prisma/client";
import { useCallback } from "react";
import { useRefetch } from "../pages/[projectId]";
import { api } from "../utils/api";
import { PlusIcon, MinusIcon } from "./util";

export const ProjectView = ({ project }: { project: Project }) => {
  const incrementPindMutation = api.project.increasePindCount.useMutation();
  const decrementPindMutation = api.project.decreasePindCount.useMutation();
  const incrementOmgangMutation = api.project.increaseOmgangCount.useMutation();
  const decrementOmgangMutation = api.project.decreaseOmgangCount.useMutation();
  const disabled =
    incrementPindMutation.isLoading ||
    decrementPindMutation.isLoading ||
    incrementOmgangMutation.isLoading ||
    decrementOmgangMutation.isLoading;

  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4">
      {/* <h2 className="my-4 mx-1 text-4xl">Projekter</h2> */}

      <h3 className="text-2xl font-bold">{project.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-2">
          <div>{project.pindCount}</div>
          <span>Pinde</span>
          <CounterButton
            value={project.pindCount}
            target="Pind"
            projectId={project.id}
            type="increase"
          />
          <CounterButton
            value={project.pindCount}
            target="Pind"
            projectId={project.id}
            type="decrease"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-2">
          <div>{project.omgangCount}</div>
          <span>Omgange</span>

          <CounterButton
            value={project.omgangCount}
            target="Omgang"
            projectId={project.id}
            type="increase"
          />
          <CounterButton
            value={project.omgangCount}
            target="Omgang"
            projectId={project.id}
            type="decrease"
          />
        </div>
      </div>
      <p className="text-lg">{project.description}</p>
    </div>
  );
};

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
  const mutation = api.project[`${type}${target}Count`].useMutation();
  const refetch = useRefetch();
  const disabled =
    mutation.status === "loading" || (type === "decrease" && value < 1);

  const performActionAndRefresh = useCallback(
    async function performActionAndRefresh(promise: Promise<unknown>) {
      await promise;
      refetch();
    },
    [refetch]
  );

  return (
    <button
      className={`mx-2 grid h-10 w-10 place-items-center rounded text-2xl font-bold  ${
        disabled
          ? "cursor-default bg-purple-200/5"
          : "bg-purple-200/20 hover:bg-white/30"
      }`}
      onClick={() =>
        void performActionAndRefresh(
          mutation.mutateAsync({
            projectId,
          })
        )
      }
      disabled={disabled}
    >
      {type === "increase" ? <PlusIcon /> : <MinusIcon />}
    </button>
  );
}
