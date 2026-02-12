import { Controller, Delete, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerQueryDto } from './dto/job-seeker-query.dto';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';

@Controller('job-seekers')
@Auth(AuthType.None)
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Get()
  async findAllProfiles(@Query() query: JobSeekerQueryDto) {
    return this.jobSeekerService.findAllProfiles(query);
  }

  @Get(':jobSeekerId')
  async findProfile(@Param('jobSeekerId', ParseUUIDPipe) jobSeekerId: string) {
    return this.jobSeekerService.findOne(jobSeekerId);
  }

  @Delete('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  async deactivate(@ActiveUser('email') email: string) {
    return this.jobSeekerService.deactivate(email);
  }
}
