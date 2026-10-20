import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SubmitToolForm } from "@/features/submissions/submit-tool-form";
import { FormSplit } from "@/features/content/form-split";

export const metadata: Metadata = {
  title: "Submit an AI Tool",
  description: "Submit an AI tool for review on SeekSmart.",
  robots: {
    index: false,
    follow: false
  },
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
    <FormSplit
      eyebrow="Submit"
      lead="Every listing is reviewed by a person before it goes live."
      lines={[["Add a tool."], [{ text: "We check it.", className: "ghost-word" }]]}
      points={["Signed-in only", "One submission per account", "Editorial review"]}
    >
      <SubmitToolForm submitterEmail={session.user.email ?? ""} />
    </FormSplit>
  );
}
