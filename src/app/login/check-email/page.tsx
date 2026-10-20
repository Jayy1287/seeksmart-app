import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MailSentMark } from "@/features/account/mail-sent-mark";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const metadata: Metadata = {
  title: "Check Your Email",
  description: "Check your inbox for your SeekSmart sign-in link.",
  robots: {
    index: false,
    follow: false
  }
};

const steps = ["Open the latest email from SeekSmart", "Tap the sign-in link", "You land back where you were"];

export default function CheckEmailPage() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]" />
      </div>
      <div className="app-container relative flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center py-16 text-center md:py-24">
        <MailSentMark />
        <Reveal className="mt-10" delay={0.2}>
          <p className="eyebrow">Link sent</p>
        </Reveal>
        <SplitReveal
          className="h1 mt-6"
          delay={0.3}
          lines={[["Check your inbox."]]}
        />
        <Reveal delay={0.6}>
          <p className="lead mx-auto mt-5">The sign-in link expires quickly. Check spam if it is not there.</p>
        </Reveal>

        <Stagger as="ol" className="mt-12 grid w-full max-w-lg text-left" delay={0.8}>
          {steps.map((step, index) => (
            <StaggerItem
              as="li"
              className="flex items-center gap-5 border-t border-ink/[0.12] py-4 last:border-b"
              key={step}
            >
              <span className="font-mono text-sm text-ink/35">0{index + 1}</span>
              <span className="font-medium">{step}</span>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3" delay={1}>
          <Link className="btn btn-ghost btn-lg" href="/login">
            <ArrowLeft aria-hidden="true" size={18} />
            Back to sign in
          </Link>
          <Link className="btn btn-primary btn-lg" href="/login?error=Verification">
            Request a fresh link
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
