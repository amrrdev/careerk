CREATE TYPE "InterviewRole" AS ENUM ('FRONTEND', 'BACKEND', 'DEVOPS', 'DATA_ENGINEER', 'SYSTEMS_ENGINEER');
CREATE TYPE "InterviewLevel" AS ENUM ('JUNIOR', 'MID', 'SENIOR');
CREATE TYPE "QuestionCategory" AS ENUM ('TECHNICAL', 'PROBLEM_SOLVING', 'BEHAVIORAL');
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

CREATE TABLE "interview_questions" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "role" "InterviewRole" NOT NULL,
    "level" "InterviewLevel" NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "question" TEXT NOT NULL,
    "difficulty" "QuestionDifficulty" NOT NULL,
    "skills" TEXT[] NOT NULL,
    "estimated_time" TEXT NOT NULL,
    "guidance" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX "interview_questions_role_level_category_idx" ON "interview_questions" ("role", "level", "category");
