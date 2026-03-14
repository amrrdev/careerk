import { Controller, Get, Query, Param } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { JobSeekerMatchesQueryDto } from './dto/job-seeker-matches-query.dto';
import { CompanyMatchesQueryDto } from './dto/company-matches-query.dto';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';

@Auth(AuthType.Bearer)
@Controller()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // ---------------- Job Seeker endpoint ----------------
  @Get('job-seekers/me/matches')
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Job seeker matches retrieved successfully')
  async getJobSeekerMatches(
    @ActiveUser('sub') jobSeekerId: string,
    @Query() query: JobSeekerMatchesQueryDto,
  ) {
    return this.matchingService.getJobSeekerMatches(jobSeekerId, query);
  }

  // ---------------- Company endpoint ----------------
  @Get('companies/me/jobs/:jobId/matches')
  @Roles(UserType.COMPANY)
  @ResponseMessage('Company job matches retrieved successfully')
  async getCompanyJobMatches(
    @ActiveUser('sub') companyId: string,
    @Param('jobId') jobId: string,
    @Query() query: CompanyMatchesQueryDto,
  ) {
    return this.matchingService.getCompanyJobMatches(companyId, jobId, query);
  }
}
