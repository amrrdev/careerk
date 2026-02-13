-- CreateEnum
CREATE TYPE "DegreeTypeEnum" AS ENUM ('HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'PHD', 'BOOTCAMP', 'CERTIFICATION', 'OTHER');

-- DropForeignKey
ALTER TABLE "job_seeker_profiles" DROP CONSTRAINT "job_seeker_profiles_job_seeker_id_fkey";

-- CreateTable
CREATE TABLE "educations" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "institution_name" VARCHAR(255) NOT NULL,
    "degree_type" "DegreeTypeEnum" NOT NULL,
    "field_of_study" VARCHAR(255) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "gpa" DOUBLE PRECISION,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "job_title" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "aliases" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_seeker_skills" (
    "id" UUID NOT NULL,
    "job_seeker_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_seeker_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "educations_job_seeker_id_idx" ON "educations"("job_seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "educations_job_seeker_id_institution_name_degree_type_field_key" ON "educations"("job_seeker_id", "institution_name", "degree_type", "field_of_study");

-- CreateIndex
CREATE INDEX "work_experiences_job_seeker_id_idx" ON "work_experiences"("job_seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "work_experiences_job_seeker_id_company_name_job_title_start_key" ON "work_experiences"("job_seeker_id", "company_name", "job_title", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE INDEX "job_seeker_skills_job_seeker_id_idx" ON "job_seeker_skills"("job_seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_seeker_skills_job_seeker_id_skill_id_key" ON "job_seeker_skills"("job_seeker_id", "skill_id");

-- AddForeignKey
ALTER TABLE "job_seeker_profiles" ADD CONSTRAINT "job_seeker_profiles_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_seeker_skills" ADD CONSTRAINT "job_seeker_skills_job_seeker_id_fkey" FOREIGN KEY ("job_seeker_id") REFERENCES "job_seekers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_seeker_skills" ADD CONSTRAINT "job_seeker_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
