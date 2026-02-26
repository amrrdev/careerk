import { Injectable } from '@nestjs/common';
import {
  CreateAnalysisData,
  AnalysisDetail,
  PaginatedAnalyses,
  UpdateAnalysisData,
  analysisDetailSelect,
  analysisListSelect,
} from '../types/analysis.types';
import { SkillGapAnalysisRepository } from './analysis.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class SkillGapAnalysisRepositoryImpl implements SkillGapAnalysisRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(jobSeekerId: string, data: CreateAnalysisData): Promise<{ id: string }> {
    return this.databaseService.skillGapAnalysis.create({
      data: {
        jobSeekerId,
        ...data,
      },
      select: { id: true },
    });
  }

  async findById(analysisId: string, jobSeekerId: string): Promise<AnalysisDetail | null> {
    return this.databaseService.skillGapAnalysis.findFirst({
      where: {
        id: analysisId,
        jobSeekerId,
      },
      ...analysisDetailSelect,
    });
  }

  async findLatest(jobSeekerId: string): Promise<AnalysisDetail | null> {
    return this.databaseService.skillGapAnalysis.findFirst({
      where: { jobSeekerId },
      ...analysisDetailSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findHistory(jobSeekerId: string, page: number, limit: number): Promise<PaginatedAnalyses> {
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      this.databaseService.skillGapAnalysis.findMany({
        where: { jobSeekerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        ...analysisListSelect,
      }),

      this.databaseService.skillGapAnalysis.count({
        where: { jobSeekerId },
      }),
    ]);
    return {
      analyses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(analysisId: string, data: UpdateAnalysisData): Promise<void> {
    await this.databaseService.skillGapAnalysis.update({
      where: { id: analysisId },
      data,
    });
  }

  async countThisWeek(jobSeekerId: string): Promise<number> {
    const weekStart = this.getWeekStart();

    return this.databaseService.skillGapAnalysis.count({
      where: {
        jobSeekerId,
        createdAt: {
          gte: weekStart,
        },
      },
    });
  }
  private getWeekStart(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }
}
