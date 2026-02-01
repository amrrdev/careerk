/*
  Warnings:

  - The primary key for the `job_seekers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `profile_image_url` on the `job_seekers` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - Changed the type of `id` on the `job_seekers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('STARTUP', 'SCALE_UP', 'ENTERPRISE', 'NON_PROFIT', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SIZE_1_50', 'SIZE_51_200', 'SIZE_201_1000', 'SIZE_1000_PLUS');

-- AlterTable
ALTER TABLE "job_seekers" DROP CONSTRAINT "job_seekers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "profile_image_url" SET DATA TYPE VARCHAR(500),
ADD CONSTRAINT "job_seekers_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" VARCHAR(500),
    "cover_url" VARCHAR(500),
    "industry" TEXT NOT NULL,
    "size" "CompanySize" NOT NULL,
    "type" "CompanyType" NOT NULL,
    "headquarters_location" VARCHAR(255),
    "founded_year" INTEGER,
    "website_url" VARCHAR(500),
    "benefits" TEXT,
    "linked_in" VARCHAR(500),
    "facebook" VARCHAR(500),
    "twitter" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies"("email");

-- CreateIndex
CREATE INDEX "companies_is_active_idx" ON "companies"("is_active");
