import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, MailCheck, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Check Your Email",
  description: "Check your inbox for your SeekSmart sign-in link.",
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckEmailPage() {
  return (
    <main className="page-shell">
      <div className="app-container grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="surface-strong rounded-[2rem] p-6 md:p-8">
          <p className="eyebrow">
            <MailCheck aria-hidden="true" size={14} />
            Check your email
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
            Your secure sign-in link is on its way.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-ink/65">
            Open the latest email from SeekSmart and use the sign-in link to
            continue. The link expires quickly for safety.
          </p>

          <div className="mt-8 grid gap-4 rounded-[1.6rem] border border-line/65 bg-white/72 p-5 shadow-[0_20px_60px_rgb(13_48_92/0.07)] backdrop-blur">
            <div className="rounded-[1.4rem] border border-line/60 bg-white/88 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/8 text-accent">
                  <Inbox aria-hidden="true" size={19} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">What to do next</h2>
                  <div className="mt-2 grid gap-2 text-sm leading-6 text-ink/62">
                    <p>1. Check your inbox and spam folder.</p>
                    <p>2. Open the latest email from SeekSmart.</p>
                    <p>3. Tap the sign-in link to return to your dashboard or audit flow.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button min-h-12 flex-1 justify-center" href="/login">
                Back to sign in
              </Link>
              <Link
                className="secondary-button min-h-12 flex-1 justify-center"
                href="/login?error=Verification"
              >
                Request a fresh link
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="surface-panel rounded-[2rem] p-6" delay={0.06}>
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden="true" className="text-accent" size={22} />
            <h2 className="font-semibold">Why this is safer</h2>
          </div>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-ink/62">
            <p>
              SeekSmart uses passwordless sign-in links, so there is no password
              to remember, reset, or accidentally reuse across sites.
            </p>
            <p>
              Links expire quickly and are single-use through the Auth.js
              verification token flow backed by the database.
            </p>
            <p>
              If the email does not arrive, return to sign in and request a new
              link instead of refreshing the same old message.
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
