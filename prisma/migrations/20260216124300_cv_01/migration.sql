-- CreateTable
CREATE TABLE "cvs" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cvs_job_seeker_id_key" ON "cvs"("job_seeker_id");

-- CreateIndex
CREATE INDEX "job_seeker_profiles_availability_status_idx" ON "job_seeker_profiles"("availability_status");

-- CreateIndex
CREATE INDEX "job_seeker_profiles_work_preference_idx" ON "job_seeker_profiles"("work_preference");

-- CreateIndex
CREATE INDEX "job_seeker_profiles_location_idx" ON "job_seeker_profiles"("location");

-- CreateIndex
CREATE INDEX "job_seeker_profiles_years_of_experience_idx" ON "job_seeker_profiles"("years_of_experience");

-- CreateIndex
CREATE INDEX "job_seeker_profiles_notice_period_idx" ON "job_seeker_profiles"("notice_period");

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
