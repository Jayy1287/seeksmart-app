import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { auth, signOut } from "@/auth";

export async function SiteAccountNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <Link
          className="primary-button hidden min-h-10 px-5 md:inline-flex"
          href="/login?callbackUrl=/audit/start"
        >
          Start audit
        </Link>
        <Link className="secondary-button min-h-10 px-4" href="/login">
          Sign in
        </Link>
      </div>
    );
  }

  async function signOutAction() {
    "use server";

    await signOut({
      redirectTo: "/"
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      <Link
        className="primary-button hidden min-h-10 px-5 md:inline-flex"
        href="/audit/start"
      >
        Start audit
      </Link>
      <Link className="secondary-button min-h-10 px-4" href="/dashboard">
        <UserRound aria-hidden="true" size={16} />
        {session.user.name?.split(" ")[0] ?? "Dashboard"}
      </Link>
      <form action={signOutAction}>
        <button className="secondary-button min-h-10 px-4" type="submit">
          <LogOut aria-hidden="true" size={16} />
          Sign out
        </button>
      </form>
    </div>
  );
}
