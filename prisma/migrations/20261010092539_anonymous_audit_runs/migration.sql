-- AlterTable
ALTER TABLE "audit_runs" ADD COLUMN     "email" TEXT,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "unlocked_at" TIMESTAMP(3),
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "audit_runs_email_idx" ON "audit_runs"("email");

-- CreateIndex
CREATE INDEX "audit_runs_expires_at_idx" ON "audit_runs"("expires_at");
