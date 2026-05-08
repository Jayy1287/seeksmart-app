import type { Metadata } from "next";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, LogIn, ShieldCheck } from "lucide-react";
import { auth, signIn } from "@/auth";

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

  if (session?.user) {
    redirect(callbackUrl as Route);
  }

  async function signInWithGoogle() {
    "use server";

    await signIn("google", {
      redirectTo: callbackUrl
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
            Use your Google account to keep audit briefs, compare shortlists,
            and access admin tools when your account has permission.
          </p>
          <form action={signInWithGoogle} className="mt-7">
            <button className="primary-button min-h-12 px-6" type="submit">
              Continue with Google
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </form>
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
              Anonymous visitors can still browse SeekSmart and generate audit
              results without signing in.
            </p>
          </div>
        </aside>
      </div>
    </main>
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
