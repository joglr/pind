import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import Head from "next/head";
import Link from "next/link";
import { FooterActions } from "../components/FooterActions";
import { Navigation } from "../components/Navigation";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Pind</title>
        <meta name="description" content="Pind - Din strikkehjælper" />
        <meta name="theme-color" content="#2e026d" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2e026d" />
        <meta name="apple-mobile-web-app-title" content="Pind" />
        <meta name="application-name" content="Pind" />
        <meta name="msapplication-TileColor" content="#603cba" />
      </Head>
      <body className="flex min-h-screen flex-col place-items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <header className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <Link href="/" className="text-[hsl(280,100%,70%)]">
              Pind
            </Link>
          </h1>
          <Navigation />
        </header>
        <main className="flex grow flex-col place-items-center">
          <Component {...pageProps} />
        </main>
        <footer className="flex flex-col place-items-center">
          <FooterActions />
          <Link className="my-2 text-white" href="/privacy">
            Privatlispolitik
          </Link>
        </footer>
      </body>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
