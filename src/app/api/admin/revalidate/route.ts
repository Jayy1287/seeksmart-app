import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/server/admin/auth";
import { apiError, apiOk } from "@/server/http/responses";

/**
 * Purge every cached page. Use after seeding or bulk content changes so the
 * long ISR windows (up to a day) do not keep stale pages around.
 *
 *   curl -X POST https://seeksmart.in/api/admin/revalidate -H "Cookie: <admin session cookie>"
 */
export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return apiError("UNAUTHORIZED", "Admin session required.", 401);
  }

  revalidatePath("/", "layout");

  return apiOk({ revalidated: true, at: new Date().toISOString() });
}
