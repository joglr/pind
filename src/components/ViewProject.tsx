import type { Project } from "@prisma/client";
import { api } from "../utils/api";

export const ProjectView = ({
  project,
  refresh,
}: {
  project: Project;
  refresh: () => void;
}) => {
  const incrementPindMutation = api.project.increasePindCount.useMutation();
  const decrementPindMutation = api.project.decreasePindCount.useMutation();
  const incrementOmgangMutation = api.project.increaseOmgangCount.useMutation();
  const decrementOmgangMutation = api.project.decreaseOmgangCount.useMutation();

  async function performActionAndRefresh(action: Promise) {
    await action;
    refresh();
  }

  const disabled =
    incrementPindMutation.isLoading ||
    decrementPindMutation.isLoading ||
    incrementOmgangMutation.isLoading ||
    decrementOmgangMutation.isLoading;

  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
      {/* <h2 className="my-4 mx-1 text-4xl text-white">Projekter</h2> */}

      <h3 className="text-2xl font-bold">{project.name}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-2">
          <div>{project.pindCount}</div>
          <span>Pinde</span>
          <button
            className={`mx-1 h-8 w-8 rounded  ${
              disabled ? "bg-purple-900" : "bg-purple-200/10"
            }`}
            onClick={() =>
              void incrementPindMutation.mutateAsync({ id: project.id })
            }
            disabled={disabled}
          >
            ➕
          </button>
          <button
            className={`mx-1 h-8 w-8 rounded  ${
              disabled ? "bg-purple-900" : "bg-purple-200/10"
            }`}
            onClick={() =>
              void decrementPindMutation.mutateAsync({
                projectId: project.id,
              })
            }
            disabled={disabled}
          >
            ➖
          </button>
        </div>
        <div className="grid grid-flow-col grid-cols-2 grid-rows-2 items-center gap-2">
          <div>{project.omgangCount}</div>
          <span>Omgange</span>
          <button
            className={`mx-1 h-8 w-8 rounded  ${
              disabled ? "bg-purple-900" : "bg-purple-200/10"
            }`}
            onClick={() =>
              void incrementOmgangMutation.mutateAsync({
                projectId: project.id,
              })
            }
            disabled={disabled}
          >
            ➕
          </button>
          <button
            className={`mx-1 h-8 w-8 rounded  ${
              disabled ? "bg-purple-900" : "bg-purple-200/10"
            }`}
            onClick={() =>
              void decrementOmgangMutation.mutateAsync({
                projectId: project.id,
              })
            }
            disabled={disabled}
          >
            ➖
          </button>
        </div>
      </div>
      <p className="text-lg">{project.description}</p>
    </div>
  );
};