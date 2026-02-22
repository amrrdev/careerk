-- CreateEnum
CREATE TYPE "JobSourceEnum" AS ENUM ('DIRECT', 'SCRAPED');

-- CreateTable
CREATE TABLE "job_bookmarks" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "job_source" "JobSourceEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_bookmarks_job_seeker_id_idx" ON "job_bookmarks"("job_seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_bookmarks_job_seeker_id_job_id_job_source_key" ON "job_bookmarks"("job_seeker_id", "job_id", "job_source");

-- AddForeignKey
ALTER TABLE "job_bookmarks" ADD CONSTRAINT "job_bookmarks_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
