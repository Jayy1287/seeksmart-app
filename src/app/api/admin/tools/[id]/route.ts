import { ZodError } from "zod";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import { isAdminAuthenticated } from "@/server/admin/auth";
import {
  AdminToolConflictError,
  updateAdminTool
} from "@/server/admin/mutations";

type AdminToolRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: AdminToolRouteContext) {
  try {
    if (!(await isAdminAuthenticated())) {
      return apiError("UNAUTHORIZED", "Admin sign in required.", 401);
    }

    const { id } = await context.params;
    const body = await request.json();
    const result = await updateAdminTool(id, body);

    if (!result) {
      return apiError("NOT_FOUND", "Tool not found.", 404);
    }

    return apiOk(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        "BAD_REQUEST",
        "Tool input is invalid.",
        400,
        error.flatten()
      );
    }

    if (error instanceof AdminToolConflictError) {
      return apiError("CONFLICT", error.message, 409);
    }

    console.error(error);
    return apiInternalError();
  }
}
