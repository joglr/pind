import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useInstallPromptState } from "../utils/hooks";
import { InstallIcon, SignInIcon, SignOutIcon } from "./icons";

export const FooterActions = () => {
  const session = useSession();
  const { installPromptVisible, setInstallPromptVisible, install } =
    useInstallPromptState();
  return (
    <div className="flex flex-col place-items-center gap-x-2 gap-y-4">
      {installPromptVisible ? (
        <button
          className="flex rounded-full bg-white/20 px-4 py-2 font-semibold no-underline transition hover:bg-green-500/30"
          onClick={() => {
            void install();
            setInstallPromptVisible(false);
          }}
        >
          <InstallIcon className="mr-2" />
          <span>Installer app</span>
        </button>
      ) : null}
      {!session.data ? (
        <Link
          className="flex rounded-full bg-white/20 px-4 py-2 font-semibold no-underline transition hover:bg-green-500/30"
          href="/sign-up"
        >
          <SignInIcon className="mr-2" />
          <span>Opret bruger</span>
        </Link>
      ) : null}
      <button
        className={`flex rounded-full bg-white/20 px-4 py-2 font-semibold no-underline transition ${
          session.data ? "hover:bg-red-500/30" : "hover:bg-green-500/30"
        }`}
        onClick={session.data ? () => void signOut() : () => void signIn()}
      >
        {session.data ? (
          <SignOutIcon className="mr-2" />
        ) : (
          <SignInIcon className="mr-2" />
        )}
        {session.data ? "Log ud" : "Log ind"}
      </button>
    </div>
  );
};
