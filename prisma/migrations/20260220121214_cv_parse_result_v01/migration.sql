/*
  Warnings:

  - The `status` column on the `cv_parse_results` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CvParseStatusEnum" AS ENUM ('PENDING', 'COMPLETED', 'CONFIRMED', 'FAILED');

-- AlterTable
ALTER TABLE "cv_parse_results" DROP COLUMN "status",
ADD COLUMN     "status" "CvParseStatusEnum" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "CvParseStatus";
