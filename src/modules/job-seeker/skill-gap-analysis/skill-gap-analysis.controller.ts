import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { Roles } from 'src/modules/iam/authentication/decorators/roles.decorator';
import { AuthType } from 'src/modules/iam/enums/auth-type.enum';
import { UserType } from 'src/modules/iam/enums/user-type.enum';
import { SkillGapAnalysisService } from './skill-gap-analysis.service';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { HistoryQueryDto } from './dto/history-query.dto';
import { SkillGapAnalysisOrchestratorService } from './skill-gap-analysis-orchestrator.service';

@Controller('job-seekers/me/skill-analysis')
@Auth(AuthType.Bearer)
@Roles(UserType.JOB_SEEKER)
export class SkillGapAnalysisController {
  constructor(
    private readonly skillAnalysisGapService: SkillGapAnalysisService,
    private readonly skillGapAnalysisOrchestrator: SkillGapAnalysisOrchestratorService,
  ) {}

  @Post()
  @ResponseMessage('Skill gap analysis started')
  async createAnalysis(@ActiveUser('sub') jobSeekerId: string) {
    return this.skillGapAnalysisOrchestrator.createAnalysisForJobSeeker(jobSeekerId);
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
