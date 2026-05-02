import type { Metadata } from "next";
import { SubmitToolForm } from "@/features/submissions/submit-tool-form";

export const metadata: Metadata = {
  title: "Submit an AI Tool",
  description: "Submit an AI tool for review on SeekSmart.",
  alternates: {
    canonical: "/submit"
  },
  openGraph: {
    title: "Submit an AI Tool",
    description: "Submit an AI tool for review on SeekSmart.",
    url: "/submit",
    type: "website"
  }
};

export default function SubmitPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[0.8fr_1.2fr]">
      <section>
        <p className="text-sm font-medium uppercase text-accent">Submit</p>
        <h1 className="mt-2 text-4xl font-semibold">Add an AI tool</h1>
        <p className="mt-4 leading-7 text-ink/65">
          Submitted tools are reviewed before publishing so the directory stays
          useful and trustworthy.
        </p>
      </section>
      <SubmitToolForm />
    </main>
  );
}
