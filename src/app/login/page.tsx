import type { Metadata } from "next";
import type { Route } from "next";
import { AuthError } from "next-auth";
import { UserRole } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "@/auth";
import {
  isEmailAuthConfigured,
  normalizeEmail
} from "@/server/auth/email";
import { MotionButton } from "@/components/motion/motion-button";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { LoginVisual } from "@/features/account/login-visual";

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

  const lead = isSignedInWithoutAdminAccess
    ? `${signedInEmail} does not have admin access. Sign out and use the approved admin account.`
    : isAuditCallback
      ? "Sign in to continue your audit. The result saves to your workspace."
      : "Keep briefs and shortlists attached to your account.";

  return (
    <main className="app-container pb-16 pt-4 md:pb-24 md:pt-8">
      <div className="grid gap-4 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
        {/* ---------- Night statement ---------- */}
        <Reveal className="order-2 lg:order-1" y={32}>
          <div
            className="night spotlight spotlight-strong flex h-full flex-col justify-between gap-12 rounded-[2rem] px-6 py-10 sm:px-10 md:rounded-[2.5rem] md:px-12 md:py-14"
            data-spotlight
          >
            <div
              aria-hidden="true"
              className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_20%_10%,black,transparent_60%)]"
            />
            <div className="relative">
              <p className="eyebrow">Workspace</p>
              <SplitReveal
                as="p"
                className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-white"
                delay={0.2}
                lines={[["Every brief,"], [{ text: "kept.", className: "text-signal" }]]}
              />
            </div>
            <div className="relative max-w-md">
              <LoginVisual />
            </div>
          </div>
        </Reveal>

        {/* ---------- Form ---------- */}
        <div className="order-1 flex items-center lg:order-2">
          <div className="mx-auto w-full max-w-md px-1 py-8 sm:py-12 lg:px-6">
            <Reveal>
              <p className="eyebrow">Sign in</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6"
              delay={0.1}
              lines={[["Welcome"], [{ text: "back.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.3}>
              <p className="mt-5 text-ink/55">{lead}</p>
            </Reveal>

            <Reveal className="mt-10" delay={0.4}>
              {errorMessage ? (
                <p
                  className="mb-6 flex items-start gap-3 rounded-2xl bg-danger/[0.07] px-4 py-3 text-sm text-danger"
                  role="alert"
                >
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                  {errorMessage}
                </p>
              ) : null}

              {isSignedInWithoutAdminAccess ? (
                <form action={signOutCurrentUser}>
                  <MotionButton className="btn btn-primary btn-lg w-full" type="submit">
                    Sign out current account
                  </MotionButton>
                </form>
              ) : (
                <div className="grid gap-6">
                  <form action={signInWithGoogle}>
                    <MotionButton
                      className="btn btn-lg w-full border border-ink/15 bg-surface text-ink hover:border-ink/40"
                      type="submit"
                    >
                      <GoogleMark />
                      Continue with Google
                    </MotionButton>
                  </form>

                  <div className="flex items-center gap-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink/35">
                    <span className="h-px flex-1 bg-ink/10" />
                    or email
                    <span className="h-px flex-1 bg-ink/10" />
                  </div>

                  {isEmailConfigured ? (
                    <form action={signInWithEmail} className="grid gap-3">
                      <label className="sr-only" htmlFor="login-email">
                        Work email
                      </label>
                      <input
                        autoComplete="email"
                        className="field min-h-[3.4rem] rounded-full px-5"
                        id="login-email"
                        inputMode="email"
                        maxLength={320}
                        name="email"
                        placeholder="you@company.com"
                        required
                        type="email"
                      />
                      <MotionButton className="btn btn-primary btn-lg w-full" type="submit">
                        Email me a sign-in link
                        <ArrowRight aria-hidden="true" size={18} />
                      </MotionButton>
                      <p className="text-center text-xs text-ink/45">No password. The link expires quickly.</p>
                    </form>
                  ) : (
                    <p className="rounded-2xl bg-ink/[0.04] px-4 py-3 text-sm text-ink/55">
                      Email sign-in is not configured in this environment.
                    </p>
                  )}
                </div>
              )}
            </Reveal>
          </div>
        </div>
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
