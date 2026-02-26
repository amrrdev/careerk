import { BadRequestException, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { Roles } from 'src/modules/iam/authentication/decorators/roles.decorator';
import { AuthType } from 'src/modules/iam/enums/auth-type.enum';
import { UserType } from 'src/modules/iam/enums/user-type.enum';
import { SkillGapAnalysisService } from './skill-gap-analysis.service';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { HistoryQueryDto } from './dto/history-query.dto';
import { JobSeekerRepository } from '../repositories/job-seeker.repository';

@Controller('job-seekers/me/skill-analysis')
@Auth(AuthType.Bearer)
@Roles(UserType.JOB_SEEKER)
export class SkillGapAnalysisController {
  constructor(
    private readonly skillAnalysisGapService: SkillGapAnalysisService,
    private readonly jobSeekerRepository: JobSeekerRepository,
  ) {}

  @Post()
  @ResponseMessage('Skill gap analysis started')
  async createAnalysis(@ActiveUser('sub') jobSeekerId: string) {
    const profile = await this.jobSeekerRepository.findMyProfile(jobSeekerId);
    if (!profile || !profile.profile) {
      throw new BadRequestException('Job seeker profile not found');
    }

    const skills = profile.jobSeekerSkills.map((jss) => jss.skill.name);
    const workExperience = profile.workExperiences.map(
      (wrkexp) =>
        `Company: ${wrkexp.companyName}, Title: ${wrkexp.jobTitle}, Description: ${wrkexp.description}`,
    );

    return this.skillAnalysisGapService.createAnalysis(
      jobSeekerId,
      profile.profile.title,
      profile.profile.yearsOfExperience || 0,
      skills,
      workExperience,
    );
  }

  @Get('latest')
  @ResponseMessage('Latest analysis retrieved successfully')
  async getLatestAnalysis(@ActiveUser('sub') jobSeekerId: string) {
    return this.skillAnalysisGapService.getLatestAnalysis(jobSeekerId);
  }

  @Get('history')
  @ResponseMessage('Analysis history retrieved successfully')
  async getAnalysisHistory(
    @ActiveUser('sub') jobSeekerId: string,
    @Query() query: HistoryQueryDto,
  ) {
    return this.skillAnalysisGapService.getAnalysisHistory(jobSeekerId, query);
  }

  @Get(':id')
  @ResponseMessage('Analysis retrieved successfully')
  getAnalysisById(@ActiveUser('sub') jobSeekerId: string, @Param('id') analysisId: string) {
    return this.skillAnalysisGapService.getAnalysisById(analysisId, jobSeekerId);
  }
}
