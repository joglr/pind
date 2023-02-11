import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Auth = () => {
  const session = useSession();
  const router = useRouter();
  return (
    <div className="grid grid-flow-col gap-2">
      {router.route !== "/" ? (
        <Link
          href="/"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Tilbage
        </Link>
      ) : null}
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-green-500/20"
        onClick={session.data ? () => void signOut() : () => void signIn()}
      >
        {session.data ? "Log ud" : "Log ind"}
      </button>
    </div>
  );
};
