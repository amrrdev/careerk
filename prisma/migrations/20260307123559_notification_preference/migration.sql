-- CreateTable
CREATE TABLE "direct_job_matches" (
    "id" UUID NOT NULL,
    "direct_job_id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "match_score" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "direct_job_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped_job_matches" (
    "id" UUID NOT NULL,
    "scraped_job_id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "match_score" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraped_job_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_seeker_notification_preferences" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "job_match_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "application_status_notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_seeker_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "direct_job_matches_job_seeker_id_match_score_idx" ON "direct_job_matches"("job_seeker_id", "match_score");

-- CreateIndex
CREATE UNIQUE INDEX "direct_job_matches_direct_job_id_job_seeker_id_key" ON "direct_job_matches"("direct_job_id", "job_seeker_id");

-- CreateIndex
CREATE INDEX "scraped_job_matches_scraped_job_id_match_score_idx" ON "scraped_job_matches"("scraped_job_id", "match_score");

-- CreateIndex
CREATE UNIQUE INDEX "scraped_job_matches_scraped_job_id_job_seeker_id_key" ON "scraped_job_matches"("scraped_job_id", "job_seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_notification_preferences_job_seeker_id_key" ON "job_seeker_notification_preferences"("job_seeker_id");

-- CreateIndex
CREATE INDEX "applications_direct_job_id_applied_at_idx" ON "applications"("direct_job_id", "applied_at");

-- CreateIndex
CREATE INDEX "applications_job_seeker_id_updated_at_idx" ON "applications"("job_seeker_id", "updated_at");

-- CreateIndex
CREATE INDEX "companies_is_active_created_at_idx" ON "companies"("is_active", "created_at");

-- CreateIndex
CREATE INDEX "direct_jobs_company_id_created_at_idx" ON "direct_jobs"("company_id", "created_at");

-- CreateIndex
CREATE INDEX "direct_jobs_status_published_at_idx" ON "direct_jobs"("status", "published_at");

-- CreateIndex
CREATE INDEX "educations_job_seeker_id_is_current_start_date_idx" ON "educations"("job_seeker_id", "is_current", "start_date");

-- CreateIndex
CREATE INDEX "job_bookmarks_job_seeker_id_created_at_idx" ON "job_bookmarks"("job_seeker_id", "created_at");

-- CreateIndex
CREATE INDEX "job_seeker_skills_job_seeker_id_created_at_idx" ON "job_seeker_skills"("job_seeker_id", "created_at");

-- CreateIndex
CREATE INDEX "job_seekers_is_active_is_verified_idx" ON "job_seekers"("is_active", "is_verified");

-- CreateIndex
CREATE INDEX "scraped_jobs_posted_at_idx" ON "scraped_jobs"("posted_at");

-- CreateIndex
CREATE INDEX "work_experiences_job_seeker_id_is_current_start_date_idx" ON "work_experiences"("job_seeker_id", "is_current", "start_date");

-- AddForeignKey
ALTER TABLE "direct_job_matches" ADD CONSTRAINT "direct_job_matches_direct_job_id_fkey" FOREIGN KEY ("direct_job_id") REFERENCES "direct_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direct_job_matches" ADD CONSTRAINT "direct_job_matches_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_job_matches" ADD CONSTRAINT "scraped_job_matches_scraped_job_id_fkey" FOREIGN KEY ("scraped_job_id") REFERENCES "scraped_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_job_matches" ADD CONSTRAINT "scraped_job_matches_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_seeker_notification_preferences" ADD CONSTRAINT "job_seeker_notification_preferences_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
