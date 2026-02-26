import { Injectable } from '@nestjs/common';
import {
  AnalysisDetail,
  CreateAnalysisData,
  PaginatedAnalyses,
  UpdateAnalysisData,
} from '../types/analysis.types';

@Injectable()
export abstract class SkillGapAnalysisRepository {
  abstract create(jobSeekerId: string, data: CreateAnalysisData): Promise<{ id: string }>;

  abstract findById(analysisId: string, jobSeekerId: string): Promise<AnalysisDetail | null>;

  abstract findLatest(jobSeekerId: string): Promise<AnalysisDetail | null>;

  abstract findHistory(
    jobSeekerId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedAnalyses>;

  abstract update(analysisId: string, data: UpdateAnalysisData): Promise<void>;
  abstract countThisWeek(jobSeekerId: string): Promise<number>;
}
