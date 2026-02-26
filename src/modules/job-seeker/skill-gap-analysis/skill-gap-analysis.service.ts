import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SkillGapAnalysisRepository } from './repository/analysis.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { GENERATE_ANALYSIS_QUEUE, SKILL_GAP_ANALYSIS } from './jobs/queue.constants';
import { Queue } from 'bullmq';
import { JobSeekerRepository } from '../repositories/job-seeker.repository';
import { HistoryQueryDto } from './dto/history-query.dto';

@Injectable()
export class SkillGapAnalysisService {
  constructor(
    private readonly analysisRepository: SkillGapAnalysisRepository,
    private readonly jobSeekerRepository: JobSeekerRepository,
    @InjectQueue(SKILL_GAP_ANALYSIS) private readonly analysisQueue: Queue,
  ) {}

  async createAnalysis(jobSeekerId: string) {
    const countThisWeek = await this.analysisRepository.countThisWeek(jobSeekerId);
    if (countThisWeek >= 10) {
      const nextMonday = this.getNextMonday();
      throw new BadRequestException(
        `You have reached your weekly limit of 3 analyses. Next analysis available on ${nextMonday.toDateString()}`,
      );
    }

    const profile = await this.jobSeekerRepository.findMyProfile(jobSeekerId);
    if (!profile || !profile.profile) {
      throw new BadRequestException('Job seeker profile not found');
    }

    const analysis = await this.analysisRepository.create(jobSeekerId, {
      targetRole: profile.profile.title,
      status: 'PROCESSING',
    });

    await this.analysisQueue.add(GENERATE_ANALYSIS_QUEUE, {
      analysisId: analysis.id,
      jobSeekerId,
    });

    return {
      id: analysis.id,
      status: 'PROCESSING',
      message: 'Analysis started. This may take 10-30 seconds.',
    };
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
