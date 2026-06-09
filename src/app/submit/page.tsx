import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
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

export default async function SubmitPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/submit");
  }

  return (
    <main className="page-shell">
      <div className="app-container grid gap-8 md:grid-cols-[0.78fr_1.22fr]">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Submit</p>
          <h1 className="mt-2 text-4xl font-semibold">Add an AI tool</h1>
          <p className="mt-4 leading-7 text-ink/65">
            Submitted tools are reviewed before publishing so the directory stays
            useful and trustworthy.
          </p>
          <div className="mt-6 grid gap-3">
            {["Signed-in only", "One submission per account", "Editorial review"].map(
              (item) => (
                <div className="status-pill w-fit" key={item}>
                  {item}
                </div>
              )
            )}
          </div>
        </section>
        <SubmitToolForm submitterEmail={session.user.email ?? ""} />
      </div>
    </main>
  );
}
