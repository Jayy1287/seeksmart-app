import { ZodError } from "zod";
import { isAdminAuthenticated } from "@/server/admin/auth";
import { upsertAdminIndustry } from "@/server/admin/mutations";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return apiError("UNAUTHORIZED", "Admin sign in required.", 401);
    }

    const body = await request.json();
    const record = await upsertAdminIndustry(null, body);

    return apiOk({ record });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError("BAD_REQUEST", "Industry input is invalid.", 400, error.flatten());
    }

    console.error(error);
    return apiInternalError();
  }
}
