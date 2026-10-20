-- AlterTable
ALTER TABLE "tools" ADD COLUMN     "best_for" TEXT,
ADD COLUMN     "content_updated_at" TIMESTAMP(3),
ADD COLUMN     "integrations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "not_for" TEXT,
ADD COLUMN     "pricing_note" TEXT,
ADD COLUMN     "screenshot_url" TEXT,
ADD COLUMN     "source_url" TEXT,
ADD COLUMN     "vendor" TEXT;
