import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SKILL_GAP_ANALYSIS } from '../jobs/queue.constants';
import { Injectable, Logger } from '@nestjs/common';
import { SkillGapAnalysisRepository } from '../repository/analysis.repository';
import { SkillGapAnalysisLLMService } from '../services/llm.service';
import { Job } from 'bullmq';

interface AnalysisJobData {
  analysisId: string;
  jobSeekerId: string;
  targetRole: string;
  yearsOfExperience: number;
  currentSkills: string[];
  workExperience: string[];
}

@Processor(SKILL_GAP_ANALYSIS)
@Injectable()
export class SkillGapAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(SkillGapAnalysisProcessor.name);
  constructor(
    private readonly analysisRepository: SkillGapAnalysisRepository,
    private readonly llmService: SkillGapAnalysisLLMService,
  ) {
    super();
  }

  async process(job: Job<AnalysisJobData>): Promise<any> {
    const { analysisId, targetRole, yearsOfExperience, currentSkills, workExperience } = job.data;

    try {
      this.logger.log(`Processing skill gap analysis ${analysisId}`);

      const result = await this.llmService.generateAnalysis({
        currentSkills,
        targetRole,
        yearsOfExperience,
        workExperience,
      });

      await this.analysisRepository.update(analysisId, {
        ...result,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } catch (error) {
      this.logger.error(`Failed to process analysis ${analysisId}:`, error);
      await this.analysisRepository.update(analysisId, {
        status: 'FAILED',
      });
    }
  }
}
