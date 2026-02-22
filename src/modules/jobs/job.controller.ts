import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { JobQueryDto } from './dto/job-query.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { BookmarkJobDto } from './dto/bookmark-job.dto';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';

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

  @Post('bookmark')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Job bookmarked successfully')
  async bookmarkJob(@ActiveUser('sub') jobSeekerId: string, @Body() dto: BookmarkJobDto) {
    return this.jobService.bookmarkJob(jobSeekerId, dto);
  }

  @Get('bookmark')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Bookmarks retrieved successfully')
  async getMyBookmarks(@ActiveUser('sub') jobSeekerId: string) {
    return this.jobService.getMyBookmarks(jobSeekerId);
  }

  @Delete('/bookmarks/:id')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Bookmark removed successfully')
  removeBookmark(@ActiveUser('sub') jobSeekerId: string, @Param('id') bookmarkId: string) {
    return this.jobService.removeBookmark(jobSeekerId, bookmarkId);
  }
}
