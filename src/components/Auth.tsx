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
    <div className="grid grid-flow-col gap-2">
      {router.route !== "/" ? (
        <Link
          href="/"
          className="rounded-full bg-white/20 px-10 py-3 font-semibold no-underline transition hover:bg-white/30"
        >
          Tilbage
        </Link>
      ) : null}
      <button
        className={`rounded-full bg-white/20 px-10 py-3 font-semibold no-underline transition ${
          session.data ? "hover:bg-red-500/30" : "hover:bg-green-500/30"
        }`}
        onClick={session.data ? () => void signOut() : () => void signIn()}
      >
        {session.data ? "Log ud" : "Log ind"}
      </button>
      {installPromptVisible ? (
        <button
          className="rounded-full bg-white/20 px-10 py-3 font-semibold no-underline transition hover:bg-green-500/30"
          onClick={() => {
            void install();
            setInstallPromptVisible(false);
          }}
        >
          Installer app
        </button>
      ) : null}
    </div>
  );
};
