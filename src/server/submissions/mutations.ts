import { prisma } from "@/lib/prisma";
import { toolSubmissionSchema } from "@/lib/validation";

export async function createToolSubmission(input: unknown) {
  const submission = toolSubmissionSchema.parse(input);

  return prisma.submission.create({
    data: {
      toolName: submission.toolName,
      websiteUrl: submission.websiteUrl,
      submitterEmail: submission.submitterEmail,
      payload: submission
    },
    select: {
      id: true,
      status: true,
      createdAt: true
    }
  });
}

