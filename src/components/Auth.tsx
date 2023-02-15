import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useInstallPromptState } from "../utils/hooks";

export const Auth = () => {
  const session = useSession();
  const router = useRouter();
  const { installPromptVisible, setInstallPromptVisible, install } =
    useInstallPromptState();
  return (
    <div className="grid-row-2 grid place-items-center gap-x-2 gap-y-4">
      {installPromptVisible ? (
        <button
          className="col-span-2 rounded-full bg-white/20 px-8 py-2 font-semibold no-underline transition hover:bg-green-500/30"
          onClick={() => {
            void install();
            setInstallPromptVisible(false);
          }}
        >
          Installer app
        </button>
      ) : null}
      {router.route !== "/" ? (
        <Link
          href="/"
          className="rounded-full bg-white/20 px-8 py-2 font-semibold no-underline transition hover:bg-white/30"
        >
          Tilbage
        </Link>
      ) : null}
      <button
        className={`rounded-full bg-white/20 px-8 py-2 font-semibold no-underline transition ${
          session.data ? "hover:bg-red-500/30" : "hover:bg-green-500/30"
        } ${router.route === "/" ? "col-span-2" : ""}`}
        onClick={session.data ? () => void signOut() : () => void signIn()}
      >
        {session.data ? "Log ud" : "Log ind"}
      </button>
    </div>
  );
};
