"use client";

import { LogOut, UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { MotionLink } from "@/components/motion/motion-link";

export function SiteAccountNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="hidden flex-wrap items-center gap-2 md:flex md:justify-end">
        <MotionLink className="primary-button min-h-10 px-5" href="/audit/questions">
          Start audit
        </MotionLink>
        <MotionLink className="secondary-button min-h-10 px-4" href="/login">
          Sign in
        </MotionLink>
      </div>
    );
  }

  return (
    <div className="hidden flex-wrap items-center gap-2 md:flex md:justify-end">
      <MotionLink className="primary-button min-h-10 px-5" href="/audit/questions">
        Start audit
      </MotionLink>
      <MotionLink className="secondary-button min-h-10 px-4" href="/dashboard">
        <UserRound aria-hidden="true" size={16} />
        {session.user.name?.split(" ")[0] ?? "Dashboard"}
      </MotionLink>
      <button
        className="secondary-button min-h-10 px-4"
        onClick={() => void signOut({ redirectTo: "/" })}
        type="button"
      >
        <LogOut aria-hidden="true" size={16} />
        Sign out
      </button>
    </div>
  );
}
