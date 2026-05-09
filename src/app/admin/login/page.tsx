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
    <main className="page-shell">
      <div className="app-container grid max-w-3xl gap-6">
        <Reveal className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold">Review workspace</h1>
          <p className="mt-3 leading-7 text-ink/65">
            Sign in with the Google admin account, or use the temporary admin
            password fallback while it remains configured.
          </p>
          {session?.user ? (
            <div className="mt-5 rounded-xl border border-signal/25 bg-signal/10 p-4 text-sm leading-6 text-ink/70">
              <p className="font-semibold text-signal">
                {session.user.email ?? "This Google account"} is signed in but
                does not have admin access.
              </p>
              <p className="mt-1">
                Sign out, then continue with Google and choose
                seeksmartapp@gmail.com.
              </p>
              <form action={signOutCurrentUser} className="mt-4">
                <MotionButton className="secondary-button" type="submit">
                  Sign out current Google account
                </MotionButton>
              </form>
            </div>
          ) : (
            <form action={signInWithGoogle} className="mt-5">
              <MotionButton className="primary-button" type="submit">
                <LogIn aria-hidden="true" size={17} />
                Continue with Google
              </MotionButton>
            </form>
          )}
        </Reveal>
        {isConfigured ? (
          <AdminLoginForm />
        ) : (
          <div className="surface-panel rounded-xl border-signal/30 p-5 text-sm leading-6 text-signal">
            Admin auth is not configured. Add ADMIN_PASSWORD to the environment
            before using the review workspace.
          </div>
        )}
      </div>
    </main>
  );
}
