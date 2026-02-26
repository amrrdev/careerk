-- CreateEnum
CREATE TYPE "AnalysisStatusEnum" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "skill_gap_analyses" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "target_role" TEXT NOT NULL,
    "status" "AnalysisStatusEnum" NOT NULL DEFAULT 'PROCESSING',
    "cv_score" DOUBLE PRECISION,
    "strengths" TEXT[],
    "gaps" JSONB,
    "recommendations" TEXT[],
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "skill_gap_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skill_gap_analyses_job_seeker_id_created_at_idx" ON "skill_gap_analyses"("job_seeker_id", "created_at");

-- CreateIndex
CREATE INDEX "skill_gap_analyses_status_idx" ON "skill_gap_analyses"("status");

-- AddForeignKey
ALTER TABLE "skill_gap_analyses" ADD CONSTRAINT "skill_gap_analyses_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
