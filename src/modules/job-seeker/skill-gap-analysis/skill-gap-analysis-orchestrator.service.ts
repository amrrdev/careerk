import { BadRequestException, Injectable } from '@nestjs/common';
import { JobSeekerRepository } from '../repositories/job-seeker.repository';
import { SkillGapAnalysisService } from './skill-gap-analysis.service';

@Injectable()
export class SkillGapAnalysisOrchestratorService {
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly skillGapAnalysisService: SkillGapAnalysisService,
  ) {}

  async createAnalysisForJobSeeker(jobSeekerId: string) {
    const profile = await this.jobSeekerRepository.findMyProfile(jobSeekerId);
    if (!profile || !profile.profile) {
      throw new BadRequestException('Job seeker profile not found');
    }

    const skills = profile.jobSeekerSkills.map((jobSeekerSkill) => jobSeekerSkill.skill.name);
    const workExperience = profile.workExperiences.map(
      (experience) =>
        `Company: ${experience.companyName}, Title: ${experience.jobTitle}, Description: ${experience.description}`,
    );

    return this.skillGapAnalysisService.createAnalysis(
      jobSeekerId,
      profile.profile.title,
      profile.profile.yearsOfExperience || 0,
      skills,
      workExperience,
    );
  }
}
