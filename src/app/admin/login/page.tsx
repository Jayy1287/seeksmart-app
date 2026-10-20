import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";
import { AdminLoginForm } from "@/features/admin/admin-login-form";
import {
  isAdminAuthConfigured,
  isAdminAuthenticated
} from "@/server/admin/auth";
import { MotionButton } from "@/components/motion/motion-button";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const session = await auth();
  const isConfigured = isAdminAuthConfigured();

  async function signInWithGoogle() {
    "use server";

    await signIn(
      "google",
      {
        redirectTo: "/admin"
      },
      {
        prompt: "select_account"
      }
    );
  }

  async function signOutCurrentUser() {
    "use server";

    await signOut({
      redirectTo: "/admin/login"
    });
  }

  return (
    <main className="app-container page-hero grid grid-cols-[minmax(0,1fr)] gap-12 pb-24 md:pb-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-20">
      <div>
        <Reveal y={10}>
          <p className="eyebrow">Admin</p>
        </Reveal>
        <SplitReveal
          className="h1 mt-6"
          delay={0.05}
          lines={[["Review"], [{ text: "workspace.", className: "ghost-word" }]]}
        />
        <Reveal delay={0.35} y={14}>
          <p className="lead mt-6">Google admin account, or the temporary password fallback.</p>
        </Reveal>
      </div>

      <Reveal className="surface grid gap-6 p-6 md:p-8" delay={0.2} y={24}>
        {session?.user ? (
          <div className="grid gap-4">
            <p className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
              <span>
                <span className="font-medium">{session.user.email ?? "This Google account"}</span>{" "}
                <span className="text-ink/60">has no admin access. Sign out, then choose seeksmartapp@gmail.com.</span>
              </span>
            </p>
            <form action={signOutCurrentUser}>
              <MotionButton className="btn btn-ghost w-full" type="submit">
                Sign out current Google account
              </MotionButton>
            </form>
          </div>
        ) : (
          <form action={signInWithGoogle}>
            <MotionButton className="btn btn-primary btn-lg w-full" type="submit">
              <LogIn aria-hidden="true" size={17} />
              Continue with Google
            </MotionButton>
          </form>
        )}
        <div className="flex items-center gap-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">
          <span className="h-px flex-1 bg-ink/10" />
          or
          <span className="h-px flex-1 bg-ink/10" />
        </div>
        {isConfigured ? (
          <AdminLoginForm />
        ) : (
          <p className="text-sm font-medium text-danger">
            Admin auth is not configured. Add ADMIN_PASSWORD to the environment.
          </p>
        )}
      </Reveal>
    </main>
  );
}
