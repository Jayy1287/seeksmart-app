import { apiOk, apiRequestError } from "@/server/http/responses";
import { assertSameOrigin, isApiRequestError } from "@/server/http/request";
import { clearAdminSessionCookie } from "@/server/admin/auth";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await clearAdminSessionCookie();

    return apiOk({ authenticated: false });
  } catch (error) {
    if (isApiRequestError(error)) {
      return apiRequestError(error);
    }

    throw error;
  }
}
