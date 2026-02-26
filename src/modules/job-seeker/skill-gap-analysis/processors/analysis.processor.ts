import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SKILL_GAP_ANALYSIS } from '../jobs/queue.constants';
import { Injectable, Logger } from '@nestjs/common';
import { SkillGapAnalysisRepository } from '../repository/analysis.repository';
import { SkillGapAnalysisLLMService } from '../services/llm.service';
import { JobSeekerRepository } from '../../repositories/job-seeker.repository';
import { Job } from 'bullmq';

@Processor(SKILL_GAP_ANALYSIS)
@Injectable()
export class SkillGapAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(SkillGapAnalysisProcessor.name);
  constructor(
    private readonly analysisRepository: SkillGapAnalysisRepository,
    private readonly llmService: SkillGapAnalysisLLMService,
    private readonly jobSeekerRepository: JobSeekerRepository,
  ) {
    super();
  }

  async process(job: Job<{ analysisId: string; jobSeekerId: string }>): Promise<any> {
    const { analysisId, jobSeekerId } = job.data;

    try {
      this.logger.log(`Processing skill gap analysis ${analysisId} for user ${jobSeekerId}`);
      const profile = await this.jobSeekerRepository.findMyProfile(jobSeekerId);
      if (!profile || !profile.profile) {
        throw new Error('Job seeker profile not found');
      }

      const skills = profile.jobSeekerSkills.map((jss) => jss.skill.name);
      const workExperience = profile.workExperiences.map(
        (wrkexp) => `
        Company Name: ${wrkexp.companyName},
        Title: ${wrkexp.jobTitle}
        Description: ${wrkexp.description}
        `,
      );
      const result = await this.llmService.generateAnalysis({
        currentSkills: skills,
        targetRole: profile.profile.title,
        yearsOfExperience: profile.profile.yearsOfExperience || 0,
        workExperience: workExperience,
      });

      await this.analysisRepository.update(analysisId, {
        ...result,
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } catch {
      await this.analysisRepository.update(analysisId, {
        status: 'FAILED',
      });
    }
  }
}
