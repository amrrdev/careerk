-- CreateEnum
CREATE TYPE "JobTypeEnum" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "AvailabilityStatusEnum" AS ENUM ('OPEN_TO_WORK', 'NOT_LOOKING', 'PASSIVELY_LOOKING');

-- CreateEnum
CREATE TYPE "WorkPreferenceEnum" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID', 'ANY');

-- CreateTable
CREATE TABLE "job_seeker_profiles" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "cv_email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "summary" TEXT,
    "location" TEXT,
    "availability_status" "AvailabilityStatusEnum" NOT NULL,
    "expected_salary" INTEGER,
    "work_preference" "WorkPreferenceEnum" NOT NULL,
    "preferred_job_types" "JobTypeEnum"[],
    "years_of_experience" DOUBLE PRECISION,
    "notice_period" INTEGER,
    "linkedin_url" VARCHAR(500),
    "portfolio_url" VARCHAR(500),
    "github_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_seeker_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_profiles_job_seeker_id_key" ON "job_seeker_profiles"("job_seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_profiles_cv_email_key" ON "job_seeker_profiles"("cv_email");

-- AddForeignKey
ALTER TABLE "job_seeker_profiles" ADD CONSTRAINT "job_seeker_profiles_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
