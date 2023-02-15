import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { api } from "../utils/api";
import ViewProjects from "../components/ViewProjects";

const Home: NextPage = () => {
  const session = useSession();
  const { data } = api.project.getProjects.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  return (
    <>
      <Head>
        <title>Pind</title>
        <meta name="description" content="Strikkehjælper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session.status === "authenticated" &&
      data?.projects &&
      data?.archivedProjects ? (
        <ViewProjects
          projects={data.projects}
          archivedProjects={data.archivedProjects}
        />
      ) : null}
    </>
  );
};

export default Home;
