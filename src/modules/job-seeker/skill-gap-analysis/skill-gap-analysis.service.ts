import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { SkillGapAnalysisRepository } from './repository/analysis.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { GENERATE_ANALYSIS_QUEUE, SKILL_GAP_ANALYSIS } from './jobs/queue.constants';
import { Queue } from 'bullmq';
import { HistoryQueryDto } from './dto/history-query.dto';

interface AnalysisJobData {
  analysisId: string;
  jobSeekerId: string;
  targetRole: string;
  yearsOfExperience: number;
  currentSkills: string[];
  workExperience: string[];
}

@Injectable()
export class SkillGapAnalysisService {
  constructor(
    private readonly analysisRepository: SkillGapAnalysisRepository,
    @InjectQueue(SKILL_GAP_ANALYSIS) private readonly analysisQueue: Queue,
  ) {}

  async createAnalysis(
    jobSeekerId: string,
    targetRole: string,
    yearsOfExperience: number,
    currentSkills: string[],
    workExperience: string[],
  ) {
    const countThisWeek = await this.analysisRepository.countThisWeek(jobSeekerId);
    if (countThisWeek >= 10) {
      const nextMonday = this.getNextMonday();
      throw new BadRequestException(
        `You have reached your weekly limit of 10 analyses. Next analysis available on ${nextMonday.toDateString()}`,
      );
    }

    const analysis = await this.analysisRepository.create(jobSeekerId, {
      targetRole,
      status: 'PROCESSING',
    });

    const jobData: AnalysisJobData = {
      analysisId: analysis.id,
      jobSeekerId,
      targetRole,
      yearsOfExperience,
      currentSkills,
      workExperience,
    };

    await this.analysisQueue.add(GENERATE_ANALYSIS_QUEUE, jobData, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
    });

    return {
      id: analysis.id,
      status: 'PROCESSING',
      message: 'Analysis started. This may take 10-30 seconds.',
    };
  }

  async getLatestAnalysisBlocking(jobSeekerId: string, maxTimeout = 120_000, pollInterval = 1_000) {
    const analysis = await this.analysisRepository.findLatest(jobSeekerId);
    if (!analysis) {
      throw new NotFoundException('No analysis found. Please create one first.');
    }

    if (analysis.status === 'COMPLETED') {
      return analysis;
    }

    if (analysis.status === 'FAILED') {
      throw new BadRequestException('Previous analysis failed. Please create a new one.');
    }

    const startedAt = Date.now();

    while (Date.now() - startedAt < maxTimeout) {
      await this.sleep(pollInterval);

      const updated = await this.analysisRepository.findLatest(jobSeekerId);
      if (!updated) {
        throw new NotFoundException('Analysis was removed during processing');
      }

      if (updated.status === 'COMPLETED') {
        return updated;
      }

      if (updated.status === 'FAILED') {
        throw new BadRequestException(
          'Skill gap analysis failed after multiple attempts. Please try again.',
        );
      }
    }

    throw new RequestTimeoutException(
      'Analysis is taking longer than expected. Please try again later.',
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getAnalysisById(analysisId: string, jobSeekerId: string) {
    const analysis = await this.analysisRepository.findById(analysisId, jobSeekerId);
    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return analysis;
  }

  async getLatestAnalysis(jobSeekerId: string) {
    const analysis = await this.analysisRepository.findLatest(jobSeekerId);
    if (!analysis) {
      throw new NotFoundException('No analysis found. Please create one first.');
    }

    return analysis;
  }

  async getAnalysisHistory(jobSeekerId: string, query: HistoryQueryDto) {
    const { page = 1, limit = 10 } = query;
    return this.analysisRepository.findHistory(jobSeekerId, page, limit);
  }

  private getNextMonday(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  }
}
