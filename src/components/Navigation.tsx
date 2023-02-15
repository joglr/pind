import Link from "next/link";
import { useRouter } from "next/router";
import { BackIcon } from "./icons";

export function Navigation() {
  const router = useRouter();
  return router.route !== "/" ? (
    <Link
      href="/"
      className="flex rounded-full bg-white/20 px-4 py-2 font-semibold no-underline transition hover:bg-white/30"
    >
      <BackIcon className="mr-2" />
      Tilbage
    </Link>
  ) : null;
}
