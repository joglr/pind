import type { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

function MyDataPage() {
  const session = useSession();

  return (
    <div>
      <h1 className="my-4 mx-1 text-4xl">Dine data</h1>
      {session.status === "authenticated" ? (
        <MyDataOverview session={session} />
      ) : (
        <span className="m-1">Log ind for at fortsætte</span>
      )}
    </div>
  );
}

function MyDataOverview({
  session,
}: {
  session: { data: Session; status: "authenticated" };
}) {
  const data = session.data;
  const projects = api.project.getAllProjects.useQuery();
  const deleteUserDataMutation = api.user.deleteUserData.useMutation();

  async function deleteUserData() {
    if (
      confirm(
        "Er du sikker på du vil slette din konto og dine projekter? Dette er permanent og kan IKKE fortrydes."
      )
    ) {
      await deleteUserDataMutation.mutateAsync();
      await signOut({ callbackUrl: "/" });
    }
  }

  const disabled = deleteUserDataMutation.isLoading;
  return (
    <div>
      <div className="m-1">
        <div className="text-white">Navn: {data.user.name}</div>
        <div className="text-white">Email: {data.user.email}</div>
        <div className="text-white">Projekter: {projects.data?.length}</div>
      </div>
      <div className="mt-2 grid place-items-center">
        <button
          className={`rounded-full bg-white/20 px-4 py-2 font-semibold no-underline transition ${
            disabled ? "" : "hover:bg-red-500/30"
          }`}
          disabled={disabled}
          onClick={() => void deleteUserData()}
        >
          {deleteUserDataMutation.isLoading ? "Sletter konto..." : "Slet konto"}
        </button>
      </div>
    </div>
  );
}

export default MyDataPage;
