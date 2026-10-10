import { permanentRedirect } from "next/navigation";

type SavedAuditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Saved briefs now live at their permanent URL; access checks happen there.
export default async function SavedAuditPage({ params }: SavedAuditPageProps) {
  const { id } = await params;
  permanentRedirect(`/audit/r/${encodeURIComponent(id)}`);
}
