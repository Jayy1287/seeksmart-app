import type { Metadata } from "next";
import type { Route } from "next";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to SeekSmart with Google.",
  robots: {
    index: false,
    follow: false
  }
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = sanitizeCallbackUrl(params.callbackUrl);
  const session = await auth();
  const isAdminCallback =
    callbackUrl === "/admin" || callbackUrl.startsWith("/admin/");
  const isAuditCallback =
    callbackUrl === "/audit/start" ||
    callbackUrl === "/audit/questions" ||
    callbackUrl.startsWith("/audit/results");
  const isSignedInWithoutAdminAccess =
    Boolean(session?.user) &&
    isAdminCallback &&
    session?.user.role !== UserRole.ADMIN;
  const signedInEmail = session?.user.email ?? "This Google account";

  if (
    session?.user &&
    (!isAdminCallback || session.user.role === UserRole.ADMIN)
  ) {
    redirect(callbackUrl as Route);
  }

  async function signInWithGoogle() {
    "use server";

    await signIn(
      "google",
      {
        redirectTo: callbackUrl
      },
      {
        prompt: "select_account"
      }
    );
  }

  async function signOutCurrentUser() {
    "use server";

    await signOut({
      redirectTo: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    });
  }

  return (
    <main className="page-shell">
      <div className="app-container grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <section className="surface-strong rounded-2xl p-6 md:p-8">
          <p className="eyebrow">
            <LogIn aria-hidden="true" size={14} />
            Sign in
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
            Save your AI decisions and return to them later.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-ink/65">
            {isSignedInWithoutAdminAccess
              ? `${signedInEmail} is signed in but does not have admin access. Choose the SeekSmart admin account to continue.`
              : isAuditCallback
                ? "Sign in to continue your AI audit. SeekSmart will return you to the audit flow and save the result to your account automatically."
                : "Use your Google account to keep audit briefs, compare shortlists, and access admin tools when your account has permission."}
          </p>
          {isSignedInWithoutAdminAccess ? (
            <form action={signOutCurrentUser} className="mt-7">
              <button className="secondary-button min-h-12 px-6" type="submit">
                Sign out current Google account
              </button>
            </form>
          ) : (
            <form action={signInWithGoogle} className="mt-7">
              <button className="google-auth-button w-full sm:w-auto" type="submit">
                <GoogleMark />
                Continue with Google
              </button>
            </form>
          )}
        </section>

        <aside className="surface-panel rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden="true" className="text-accent" size={22} />
            <h2 className="font-semibold">What gets saved</h2>
          </div>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-ink/62">
            <p>
              Signed-in audit results are saved to your account automatically.
            </p>
            <p>
              Public pages remain browseable, but running an audit requires
              sign-in so your brief has a secure owner and history.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
        fill="#EA4335"
      />
    </svg>
  );
}

function sanitizeCallbackUrl(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (
    rawValue &&
    rawValue.startsWith("/") &&
    !rawValue.startsWith("//") &&
    !rawValue.startsWith("/api/auth")
  ) {
    return rawValue;
  }

  return "/dashboard";
}
