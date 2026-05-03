import { ZodError } from "zod";
import { isAdminAuthenticated } from "@/server/admin/auth";
import { upsertAdminOpportunity } from "@/server/admin/mutations";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isAdminAuthenticated())) {
      return apiError("UNAUTHORIZED", "Admin sign in required.", 401);
    }

    const { id } = await context.params;
    const body = await request.json();
    const record = await upsertAdminOpportunity(id, body);

    return apiOk({ record });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError("BAD_REQUEST", "Opportunity input is invalid.", 400, error.flatten());
    }

    console.error(error);
    return apiInternalError();
  }
}
