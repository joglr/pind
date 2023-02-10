import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { api } from "../utils/api";
import ViewProjects from "../components/ViewProjects";
import ProjectForm from "../components/ProjectForm";

const Home: NextPage = () => {
  const session = useSession();
  const { data: projects, refetch } = api.project.getAllProjects.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  return (
    <>
      <Head>
        <title>Pind</title>
        <meta name="description" content="Strikkehjælper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session.status === "authenticated" && projects ? (
        <ViewProjects projects={projects} refetch={refetch} />
      ) : null}
    </>
  );
};

export default Home;
