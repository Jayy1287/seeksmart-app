import { ZodError } from "zod";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import {
  createToolSubmission,
  DuplicateSubmissionError
} from "@/server/submissions/mutations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const submission = await createToolSubmission(body);

    return apiOk({ submission }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        "BAD_REQUEST",
        "Submission input is invalid.",
        400,
        error.flatten()
      );
    }

    if (error instanceof DuplicateSubmissionError) {
      return apiError("CONFLICT", error.message, 409);
    }

    console.error(error);
    return apiInternalError();
  }
}
