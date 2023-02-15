import type { Project } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { S } from "../i18n";
import { api } from "../utils/api";
import { PlusIcon, MinusIcon, ArchiveIcon, RestoreIcon } from "./icons";

export const ProjectView = ({ project }: { project: Project }) => {
  const router = useRouter();
  const ctx = api.useContext();

  const restoreProjectMutation = api.project.restoreProject.useMutation({
    onSuccess: async () => {
      await ctx.project.invalidate();
    },
  });
  const archiveProjectMutation = api.project.archiveProject.useMutation({
    onSuccess: async () => {
      await ctx.project.invalidate();
    },
  });

  const permanentlyDeleteProjectMutation =
    api.project.permanentlyDeleteProject.useMutation({
      onSuccess: async () => {
        await router.push("/");
      },
    });

  function archiveProject() {
    void archiveProjectMutation.mutateAsync({
      id: project.id,
    });
  }

  function permanentlyDeleteProject() {
    if (!confirm(S("confirmDelete"))) return;
    void permanentlyDeleteProjectMutation.mutateAsync({
      id: project.id,
    });
  }

  function restoreProject() {
    void restoreProjectMutation.mutateAsync({
      id: project.id,
    });
  }

  const isArchiving = archiveProjectMutation.isLoading;
  const isRestoring = restoreProjectMutation.isLoading;
  const isDeleting = permanentlyDeleteProjectMutation.isLoading;
  const disabled = isArchiving || isRestoring || isDeleting;

  return (
    <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4">
      <h3
        className={`text-2xl font-bold ${
          project.archived ? "text-white/40" : ""
        }`}
      >
        {project.name}{" "}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Counter
          project={project}
          target="Pind"
          label="Pinde"
          disabled={project.archived}
        />
        <Counter
          project={project}
          target="Omgang"
          label="Omgange"
          disabled={project.archived}
        />
      </div>
      <p className="text-lg">{project.description}</p>
      <div className="grid gap-4">
        {project.archived ? (
          <>
            <button
              className={`flex items-center gap-2 rounded bg-purple-200/20 p-2 ${
                project.archived
                  ? "hover:bg-green-500/30"
                  : " hover:bg-red-500/30"
              }`}
              onClick={restoreProject}
              disabled={disabled}
            >
              <RestoreIcon className="mr-2" />
              {isRestoring ? "Gendanner projekt..." : "Gendan projekt"}
            </button>
            <button
              className="flex items-center gap-2 rounded bg-purple-200/20 p-2 hover:bg-red-500/30"
              onClick={permanentlyDeleteProject}
              disabled={disabled}
            >
              <ArchiveIcon className="mr-2" />
              Slet permanent
            </button>
          </>
        ) : (
          <button
            className="flex grow items-center justify-center gap-2 rounded bg-purple-200/20 p-2 hover:bg-red-500/30"
            onClick={archiveProject}
            disabled={disabled}
          >
            <ArchiveIcon className="mr-2" />
            {isArchiving ? "Arkiverer projekt..." : "Arkiver projekt"}
          </button>
        )}
      </div>
    </div>
  );
};

function Counter({
  project,
  target,
  label,
  disabled,
}: {
  project: Project;
  target: "Pind" | "Omgang";
  label: string;
  disabled: boolean;
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
        disabled={disabled}
      />
      <CounterButton
        value={project[targetKey]}
        target={target}
        projectId={project.id}
        type="decrease"
        disabled={disabled}
      />
    </div>
  );
}

function CounterButton({
  value,
  type,
  target,
  projectId,
  disabled,
}: {
  value: number;
  type: "increase" | "decrease";
  target: "Pind" | "Omgang";
  projectId: string;
  disabled: boolean;
}) {
  const ctx = api.useContext();
  const mutation = api.project[`${type}${target}Count`].useMutation({
    onSuccess: async () => {
      await ctx.project.invalidate();
    },
  });

  const isDisabled = (type === "decrease" && value < 1) || disabled;

  return (
    <button
      className={`mx-2 grid h-10 w-10 place-items-center rounded text-2xl font-bold  ${
        isDisabled
          ? "cursor-default bg-purple-200/5"
          : "bg-purple-200/20 hover:bg-white/30"
      }`}
      onClick={() =>
        void mutation.mutateAsync({
          projectId,
        })
      }
      disabled={isDisabled}
    >
      {type === "increase" ? <PlusIcon /> : <MinusIcon />}
    </button>
  );
}
