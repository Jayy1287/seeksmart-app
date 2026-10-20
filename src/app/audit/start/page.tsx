import { permanentRedirect } from "next/navigation";

// The separate "start" screen was a login gate. The audit now starts directly.
export default function AuditStartPage() {
  permanentRedirect("/audit/questions");
}
