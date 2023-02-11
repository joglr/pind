import { Session } from "next-auth";
import { SessionContextValue, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../utils/api";

function MyDataPage() {
  const session = useSession();

  return (
    <div>
      <h1 className="text-white">Dine data</h1>
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

  return (
    <div>
      <h1 className="text-white">Dine data</h1>
      <div className="m-1">
        <div className="text-white">Navn: {data.user.name}</div>
        <div className="text-white">Email: {data.user.email}</div>
        <div className="text-white">Projekter: {projects.data?.length}</div>
      </div>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-red-500/20"
        disabled={deleteUserDataMutation.isLoading}
        onClick={() => void deleteUserData()}
      >
        {deleteUserDataMutation.isLoading ? "Sletter konto..." : "Slet konto"}
      </button>
    </div>
  );
}

export default MyDataPage;
