-- CreateTable
CREATE TABLE "scraped_jobs" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "salary" TEXT,
    "job_type" "JobTypeEnum",
    "posted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scraped_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraped_job_skills" (
    "id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraped_job_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scraped_jobs_url_key" ON "scraped_jobs"("url");

-- CreateIndex
CREATE INDEX "scraped_jobs_source_idx" ON "scraped_jobs"("source");

-- CreateIndex
CREATE INDEX "scraped_jobs_company_name_idx" ON "scraped_jobs"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "scraped_job_skills_job_id_skill_id_key" ON "scraped_job_skills"("job_id", "skill_id");

-- AddForeignKey
ALTER TABLE "scraped_job_skills" ADD CONSTRAINT "scraped_job_skills_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "scraped_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraped_job_skills" ADD CONSTRAINT "scraped_job_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
