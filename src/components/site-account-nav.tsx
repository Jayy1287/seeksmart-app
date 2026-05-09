import { LogOut, UserRound } from "lucide-react";
import { UserRole } from "@prisma/client";
import { auth, signOut } from "@/auth";
import { CommandPalette } from "@/components/command-palette";
import { MotionLink } from "@/components/motion/motion-link";

export async function SiteAccountNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <CommandPalette isAdmin={false} isSignedIn={false} />
        <MotionLink
          className="primary-button hidden min-h-10 px-5 md:inline-flex"
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
    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      <CommandPalette
        isAdmin={session.user.role === UserRole.ADMIN}
        isSignedIn={true}
      />
      <MotionLink
        className="primary-button hidden min-h-10 px-5 md:inline-flex"
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
