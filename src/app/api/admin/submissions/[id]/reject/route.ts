import { ZodError } from "zod";
import {
  apiError,
  apiInternalError,
  apiOk,
  apiRequestError
} from "@/server/http/responses";
import {
  assertSameOrigin,
  isApiRequestError,
  readJsonBody
} from "@/server/http/request";
import { isAdminAuthenticated } from "@/server/admin/auth";
import {
  SubmissionNotReviewableError,
  rejectSubmission
} from "@/server/submissions/mutations";

type RejectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RejectRouteContext) {
  try {
    assertSameOrigin(request);

    if (!(await isAdminAuthenticated())) {
      return apiError("UNAUTHORIZED", "Admin sign in required.", 401);
    }

    const { id } = await context.params;
    const body = await readJsonBody(request);
    const result = await rejectSubmission(id, body);

    if (!result) {
      return apiError("NOT_FOUND", "Submission not found.", 404);
    }

    return apiOk(result);
  } catch (error) {
    if (isApiRequestError(error)) {
      return apiRequestError(error);
    }

    if (error instanceof ZodError) {
      return apiError(
        "BAD_REQUEST",
        "Rejection input is invalid.",
        400,
        error.flatten()
      );
    }

    if (error instanceof SubmissionNotReviewableError) {
      return apiError("CONFLICT", error.message, 409);
    }

    console.error(error);
    return apiInternalError();
  }
}
