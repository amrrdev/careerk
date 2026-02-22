-- CreateEnum
CREATE TYPE "ExperienceLevelEnum" AS ENUM ('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'MANAGER');

-- CreateEnum
CREATE TYPE "DirectJobStatusEnum" AS ENUM ('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED', 'FILLED');

-- CreateTable
CREATE TABLE "direct_jobs" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "responsibilities" TEXT,
    "location" TEXT,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "job_type" "JobTypeEnum" NOT NULL,
    "work_preference" "WorkPreferenceEnum" NOT NULL,
    "experience_level" "ExperienceLevelEnum" NOT NULL,
    "status" "DirectJobStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "direct_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direct_job_skills" (
    "id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direct_job_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "direct_jobs_company_id_idx" ON "direct_jobs"("company_id");

-- CreateIndex
CREATE INDEX "direct_jobs_status_idx" ON "direct_jobs"("status");

-- CreateIndex
CREATE UNIQUE INDEX "direct_job_skills_job_id_skill_id_key" ON "direct_job_skills"("job_id", "skill_id");

-- AddForeignKey
ALTER TABLE "direct_jobs" ADD CONSTRAINT "direct_jobs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_job_skills" ADD CONSTRAINT "direct_job_skills_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "direct_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_job_skills" ADD CONSTRAINT "direct_job_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
