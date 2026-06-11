-- CreateEnum
CREATE TYPE "InterviewRole" AS ENUM ('FRONTEND', 'BACKEND', 'DEVOPS', 'DATA_ENGINEER', 'SYSTEMS_ENGINEER');

-- CreateEnum
CREATE TYPE "InterviewLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('TECHNICAL', 'PROBLEM_SOLVING', 'BEHAVIORAL');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "interview_questions" (
    "id" UUID NOT NULL,
    "role" "InterviewRole" NOT NULL,
    "level" "InterviewLevel" NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "question" TEXT NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "skills" TEXT[] NOT NULL,
    "estimated_time" TEXT NOT NULL,
    "guidance" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interview_questions_role_level_category_idx" ON "interview_questions"("role", "level", "category");
