import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import Head from "next/head";
import Link from "next/link";
import { Auth } from "../components/Auth";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Pind</title>
        <meta name="description" content="Strikkehjælper" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <Link href="/" className="text-[hsl(280,100%,70%)]">
              Pind
            </Link>
          </h1>
          <Component {...pageProps} />
          <Auth />
          <Link className="text-white" href="/privacy">
            Privatlispolitik
          </Link>
        </div>
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
