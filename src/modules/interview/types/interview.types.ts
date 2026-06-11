import { Prisma } from 'generated/prisma/client';
import { InterviewRole, InterviewLevel, QuestionCategory } from 'generated/prisma/enums';

export const interviewQuestionSelect = {
  select: {
    id: true,
    role: true,
    level: true,
    category: true,
    question: true,
    difficulty: true,
    skills: true,
    estimatedTime: true,
    guidance: true,
    createdAt: true,
  },
} satisfies Prisma.InterviewQuestionDefaultArgs;

export type InterviewQuestionItem = Prisma.InterviewQuestionGetPayload<
  typeof interviewQuestionSelect
>;

export type InterviewQuestionFilters = {
  role?: InterviewRole;
  level?: InterviewLevel;
  category?: QuestionCategory;
  page?: number;
  limit?: number;
};

export type PaginatedInterviewQuestions = {
  questions: InterviewQuestionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
