import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { JobSeekerApplicationService } from './application.service';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { ApplyJobDto } from './dto/apply-job.dto';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/modules/iam/enums/auth-type.enum';
import { UserType } from 'src/modules/iam/enums/user-type.enum';
import { Roles } from 'src/modules/iam/authentication/decorators/roles.decorator';

@Controller('job-seekers/me/applications')
@Auth(AuthType.Bearer)
@Roles(UserType.JOB_SEEKER)
export class JobSeekerApplicationController {
  constructor(private readonly applicationService: JobSeekerApplicationService) {}

  @Get()
  @ResponseMessage('Applications retrieved successfully')
  getMyApplications(@ActiveUser('sub') jobSeekerId: string, @Query() query: ApplicationQueryDto) {
    return this.applicationService.getMyApplications(jobSeekerId, query);
  }

  @Post()
  @ResponseMessage('Application submitted successfully')
  applyToJob(@ActiveUser('sub') jobSeekerId: string, @Body() dto: ApplyJobDto) {
    return this.applicationService.applyToJob(jobSeekerId, dto.jobId);
  }

  @Get(':id')
  @ResponseMessage('Application retrieved successfully')
  getApplicationById(@ActiveUser('sub') jobSeekerId: string, @Param('id') applicationId: string) {
    return this.applicationService.getApplicationById(jobSeekerId, applicationId);
  }

  @Delete(':id')
  @ResponseMessage('Application withdrawn successfully')
  withdrawApplication(@ActiveUser('sub') jobSeekerId: string, @Param('id') applicationId: string) {
    return this.applicationService.withdrawApplication(jobSeekerId, applicationId);
  }
}
