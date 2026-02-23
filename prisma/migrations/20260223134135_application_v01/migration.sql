-- CreateEnum
CREATE TYPE "ApplicationStatusEnum" AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'REJECTED', 'HIRED');

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "direct_job_id" UUID NOT NULL,
    "status" "ApplicationStatusEnum" NOT NULL DEFAULT 'PENDING',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_direct_job_id_idx" ON "applications"("direct_job_id");

-- CreateIndex
CREATE INDEX "applications_job_seeker_id_idx" ON "applications"("job_seeker_id");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "applications_job_seeker_id_direct_job_id_key" ON "applications"("job_seeker_id", "direct_job_id");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_direct_job_id_fkey" FOREIGN KEY ("direct_job_id") REFERENCES "direct_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
