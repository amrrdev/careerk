-- CreateEnum
CREATE TYPE "CvParseStatus" AS ENUM ('PENDING', 'COMPLETED', 'CONFIRMED', 'FAILED');

-- CreateTable
CREATE TABLE "cv_parse_results" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "cv_key" TEXT NOT NULL,
    "status" "CvParseStatus" NOT NULL DEFAULT 'PENDING',
    "parsed_data" JSONB,
    "parsed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_parse_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cv_parse_results_job_seeker_id_key" ON "cv_parse_results"("job_seeker_id");

-- AddForeignKey
ALTER TABLE "cv_parse_results" ADD CONSTRAINT "cv_parse_results_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
