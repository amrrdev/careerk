import { Controller, Get, Param, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { JobQueryDto } from './dto/job-query.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';

@Controller('jobs')
@Auth(AuthType.None)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async findAll(@Query() query: JobQueryDto) {
    return this.jobService.findAll(query);
  }

  @Get('direct/:jobId')
  async findDirectJobById(@Param('jobId') jobId: string) {
    return this.jobService.findDirectJobById(jobId);
  }
  @Get('scraped/:jobId')
  async findScrapedJobById(@Param('jobId') jobId: string) {
    return this.jobService.findScrapedJobById(jobId);
  }
}
