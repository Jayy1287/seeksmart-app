-- CreateEnum
CREATE TYPE "EffortLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "tool_use_cases" ADD COLUMN     "best_for" TEXT,
ADD COLUMN     "fit_score" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "implementation_note" TEXT,
ADD COLUMN     "limitations" TEXT,
ADD COLUMN     "pricing_suitability" TEXT,
ADD COLUMN     "recommendation_note" TEXT;

-- AlterTable
ALTER TABLE "use_cases" ADD COLUMN     "business_function_id" TEXT,
ADD COLUMN     "effort_level" "EffortLevel" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "implementation_steps" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "outcome" TEXT,
ADD COLUMN     "pain_points" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "required_inputs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "risk_level" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "success_metrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "time_to_value" TEXT;

-- CreateTable
CREATE TABLE "business_functions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_functions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "starting_point" TEXT,
    "cautions" TEXT,
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "pain_point" TEXT,
    "expected_benefit" TEXT,
    "starting_point" TEXT,
    "effort_level" "EffortLevel" NOT NULL DEFAULT 'MEDIUM',
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "time_to_value" TEXT,
    "success_metrics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "business_function_id" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_opportunities" (
    "industry_id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "industry_opportunities_pkey" PRIMARY KEY ("industry_id","opportunity_id")
);

-- CreateTable
CREATE TABLE "opportunity_use_cases" (
    "opportunity_id" TEXT NOT NULL,
    "use_case_id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opportunity_use_cases_pkey" PRIMARY KEY ("opportunity_id","use_case_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_functions_slug_key" ON "business_functions"("slug");

-- CreateIndex
CREATE INDEX "business_functions_status_sort_order_idx" ON "business_functions"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "industries_slug_key" ON "industries"("slug");

-- CreateIndex
CREATE INDEX "industries_status_sort_order_idx" ON "industries"("status", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "opportunities_slug_key" ON "opportunities"("slug");

-- CreateIndex
CREATE INDEX "opportunities_status_sort_order_idx" ON "opportunities"("status", "sort_order");

-- CreateIndex
CREATE INDEX "opportunities_business_function_id_idx" ON "opportunities"("business_function_id");

-- CreateIndex
CREATE INDEX "industry_opportunities_opportunity_id_idx" ON "industry_opportunities"("opportunity_id");

-- CreateIndex
CREATE INDEX "opportunity_use_cases_use_case_id_idx" ON "opportunity_use_cases"("use_case_id");

-- CreateIndex
CREATE INDEX "use_cases_business_function_id_idx" ON "use_cases"("business_function_id");

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_business_function_id_fkey" FOREIGN KEY ("business_function_id") REFERENCES "business_functions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_opportunities" ADD CONSTRAINT "industry_opportunities_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_opportunities" ADD CONSTRAINT "industry_opportunities_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_use_cases" ADD CONSTRAINT "opportunity_use_cases_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunity_use_cases" ADD CONSTRAINT "opportunity_use_cases_use_case_id_fkey" FOREIGN KEY ("use_case_id") REFERENCES "use_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "use_cases" ADD CONSTRAINT "use_cases_business_function_id_fkey" FOREIGN KEY ("business_function_id") REFERENCES "business_functions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
