import type { Metadata } from "next";
import type { Route } from "next";
import { AuthError } from "next-auth";
import { UserRole } from "@prisma/client";
import { Mail, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import {
  isEmailAuthConfigured,
  normalizeEmail
} from "@/server/auth/email";
import { MotionButton } from "@/components/motion/motion-button";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to SeekSmart with email or Google.",
  robots: {
    index: false,
    follow: false
  }
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    error?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = sanitizeCallbackUrl(params.callbackUrl);
  const error = getSingle(params.error);
  const session = await auth();
  const isEmailConfigured = isEmailAuthConfigured();
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
  const signedInEmail = session?.user.email ?? "This account";
  const errorMessage = getLoginErrorMessage(error);

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

  async function signInWithEmail(formData: FormData) {
    "use server";

    if (!isEmailAuthConfigured()) {
      redirect(
        `/login?callbackUrl=${encodeURIComponent(callbackUrl)}&error=email_not_configured`
      );
    }

    const rawEmail = String(formData.get("email") ?? "");
    const email = normalizeEmail(rawEmail);

    if (!isLikelyEmail(email)) {
      redirect(
        `/login?callbackUrl=${encodeURIComponent(callbackUrl)}&error=invalid_email`
      );
    }

    try {
      await signIn("resend", {
        email,
        redirectTo: callbackUrl
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(
          `/login?callbackUrl=${encodeURIComponent(callbackUrl)}&error=email_signin_failed`
        );
      }

      throw error;
    }
  }

  async function signOutCurrentUser() {
    "use server";

    await signOut({
      redirectTo: `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    });
  }

  return (
    <main className="page-shell">
      <div className="app-container grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <Reveal className="surface-strong rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">
            <LogIn aria-hidden="true" size={14} />
            Sign in
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Save your AI decisions and come back with context intact.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-ink/65">
            {isSignedInWithoutAdminAccess
              ? `${signedInEmail} is signed in but does not have admin access. Choose the approved admin account to continue.`
              : isAuditCallback
                ? "Sign in to continue your audit. SeekSmart will return you to the flow and save the result to your workspace automatically."
                : "Use email or Google to keep audit briefs, shortlists, and decision history attached to your account."}
          </p>

          <div className="mt-8 grid gap-4 rounded-[1.6rem] border border-line/65 bg-white/70 p-4 shadow-[0_20px_60px_rgb(13_48_92/0.07)] backdrop-blur md:p-5">
            {errorMessage ? (
              <div className="rounded-2xl border border-signal/25 bg-signal/10 px-4 py-3 text-sm leading-6 text-ink/72">
                {errorMessage}
              </div>
            ) : null}

            {isSignedInWithoutAdminAccess ? (
              <form action={signOutCurrentUser}>
                <MotionButton
                  className="secondary-button min-h-12 w-full justify-center"
                  type="submit"
                >
                  Sign out current account
                </MotionButton>
              </form>
            ) : (
              <>
                <section className="rounded-[1.4rem] border border-line/60 bg-white/82 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/8 text-accent">
                      <Mail aria-hidden="true" size={18} />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">Continue with email</h2>
                      <p className="text-sm leading-6 text-ink/58">
                        We’ll send a secure sign-in link. No password required.
                      </p>
                    </div>
                  </div>
                  {isEmailConfigured ? (
                    <form action={signInWithEmail} className="mt-4 grid gap-3">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">Work email</span>
                        <input
                          autoComplete="email"
                          className="control-field min-h-12"
                          inputMode="email"
                          maxLength={320}
                          name="email"
                          placeholder="you@company.com"
                          required
                          type="email"
                        />
                      </label>
                      <MotionButton
                        className="primary-button min-h-12 w-full justify-center"
                        type="submit"
                      >
                        Email me a sign-in link
                      </MotionButton>
                    </form>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-line/60 bg-paper/80 px-4 py-3 text-sm leading-6 text-ink/60">
                      Email sign-in is not configured yet in this environment.
                    </div>
                  )}
                </section>

                <div className="flex items-center gap-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink/35">
                  <span className="h-px flex-1 bg-line/70" />
                  Or
                  <span className="h-px flex-1 bg-line/70" />
                </div>

                <section className="rounded-[1.4rem] border border-line/60 bg-white/82 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/8 text-accent">
                      <Sparkles aria-hidden="true" size={18} />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold">Continue with Google</h2>
                      <p className="text-sm leading-6 text-ink/58">
                        Fastest path if your work already lives in Google.
                      </p>
                    </div>
                  </div>
                  <form action={signInWithGoogle} className="mt-4">
                    <MotionButton
                      className="google-auth-button w-full justify-center"
                      type="submit"
                    >
                      <GoogleMark />
                      Continue with Google
                    </MotionButton>
                  </form>
                </section>
              </>
            )}
          </div>
        </Reveal>

        <Reveal className="surface-panel rounded-[2rem] p-6" delay={0.06}>
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden="true" className="text-accent" size={22} />
            <h2 className="font-semibold">What gets saved</h2>
          </div>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-ink/62">
            <p>
              Signed-in audit results are saved to your account automatically so
              you can revisit readiness scores, top opportunities, and tool
              shortlists later.
            </p>
            <p>
              Liked tools stay attached to your workspace, which makes the
              dashboard useful as an actual buying desk instead of a one-time
              report.
            </p>
            <p>
              Public pages remain browseable, but running an audit or submitting
              a tool requires sign-in so every saved artifact has a secure owner.
            </p>
          </div>
        </Reveal>
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
  const rawValue = getSingle(value);

  if (
    rawValue &&
    rawValue.length <= 500 &&
    rawValue.startsWith("/") &&
    !rawValue.startsWith("//") &&
    !rawValue.startsWith("/api/")
  ) {
    return rawValue;
  }

  return "/dashboard";
}

function getSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getLoginErrorMessage(error?: string) {
  switch (error) {
    case "invalid_email":
      return "Enter a valid email address to continue.";
    case "email_not_configured":
      return "Email sign-in is not configured in this environment yet.";
    case "email_signin_failed":
      return "We could not start email sign-in right now. Please try again.";
    case "Verification":
      return "That sign-in link is invalid or has expired. Request a fresh email link.";
    default:
      return null;
  }
}
