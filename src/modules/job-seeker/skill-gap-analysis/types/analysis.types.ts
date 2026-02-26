import { AnalysisStatusEnum, Prisma } from 'generated/prisma/client';

export type SkillGapAnalysis = Prisma.SkillGapAnalysisGetPayload<object>;

export type CreateAnalysisData = Pick<SkillGapAnalysis, 'status' | 'targetRole'>;

export type UpdateAnalysisData = {
  status?: AnalysisStatusEnum;
  cvScore?: number;
  strengths?: string[];
  gaps?: any;
  recommendations?: string[];
  completedAt?: Date;
};

export const analysisListSelect = {
  select: {
    id: true,
    targetRole: true,
    status: true,
    cvScore: true,
    createdAt: true,
    completedAt: true,
  },
} satisfies Prisma.SkillGapAnalysisDefaultArgs;

export type AnalysisListItem = Prisma.SkillGapAnalysisGetPayload<typeof analysisListSelect>;

export const analysisDetailSelect = {
  select: {
    id: true,
    targetRole: true,
    status: true,
    cvScore: true,
    strengths: true,
    gaps: true,
    recommendations: true,
    createdAt: true,
    completedAt: true,
  },
} satisfies Prisma.SkillGapAnalysisDefaultArgs;

export type AnalysisDetail = Prisma.SkillGapAnalysisGetPayload<typeof analysisDetailSelect>;

export type PaginatedAnalyses = {
  analyses: AnalysisListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type GenerateAnalysisInput = {
  targetRole: string;
  currentSkills: string[];
  yearsOfExperience: number;
  workExperience: string[];
};
