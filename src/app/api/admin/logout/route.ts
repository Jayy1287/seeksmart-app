import { apiOk } from "@/server/http/responses";
import { clearAdminSessionCookie } from "@/server/admin/auth";

export async function POST() {
  await clearAdminSessionCookie();

  return apiOk({ authenticated: false });
}
