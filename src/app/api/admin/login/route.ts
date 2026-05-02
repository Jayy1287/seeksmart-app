import { ZodError } from "zod";
import { adminLoginSchema } from "@/lib/validation";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import {
  isAdminAuthConfigured,
  setAdminSessionCookie,
  verifyAdminPassword
} from "@/server/admin/auth";

export async function POST(request: Request) {
  try {
    if (!isAdminAuthConfigured()) {
      return apiError(
        "INTERNAL_SERVER_ERROR",
        "Admin auth is not configured.",
        500
      );
    }

    const body = await request.json();
    const { password } = adminLoginSchema.parse(body);

    if (!verifyAdminPassword(password)) {
      return apiError("UNAUTHORIZED", "Invalid admin password.", 401);
    }

    const didSetCookie = await setAdminSessionCookie();

    if (!didSetCookie) {
      return apiInternalError();
    }

    return apiOk({ authenticated: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError("BAD_REQUEST", "Login input is invalid.", 400);
    }

    console.error(error);
    return apiInternalError();
  }
}
