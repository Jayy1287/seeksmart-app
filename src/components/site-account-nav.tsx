import { LogOut, UserRound } from "lucide-react";
import { auth, signOut } from "@/auth";
import { MotionLink } from "@/components/motion/motion-link";

export async function SiteAccountNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="hidden flex-wrap items-center gap-2 md:flex md:justify-end">
        <MotionLink
          className="primary-button min-h-10 px-5"
          href="/login?callbackUrl=/audit/start"
        >
          Start audit
        </MotionLink>
        <MotionLink className="secondary-button min-h-10 px-4" href="/login">
          Sign in
        </MotionLink>
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
    <div className="hidden flex-wrap items-center gap-2 md:flex md:justify-end">
      <MotionLink
        className="primary-button min-h-10 px-5"
        href="/audit/start"
      >
        Start audit
      </MotionLink>
      <MotionLink className="secondary-button min-h-10 px-4" href="/dashboard">
        <UserRound aria-hidden="true" size={16} />
        {session.user.name?.split(" ")[0] ?? "Dashboard"}
      </MotionLink>
      <form action={signOutAction}>
        <button className="secondary-button min-h-10 px-4" type="submit">
          <LogOut aria-hidden="true" size={16} />
          Sign out
        </button>
      </form>
    </div>
  );
}
