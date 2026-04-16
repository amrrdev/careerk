import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerQueryDto } from './dto/job-seeker-query.dto';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { UpdateJobSeekerProfileDto } from './dto/update-job-seeker-profile.dto';
import { RequestProfileImageUploadDto } from './dto/request-profile-image-upload.dto';
import { ConfirmProfileImageUploadDto } from './dto/confirm-profile-image-upload.dto';

@Controller('job-seekers')
@Auth(AuthType.None)
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Get()
  @ResponseMessage('Job seeker profiles retrieved successfully')
  async findAllProfiles(@Query() query: JobSeekerQueryDto) {
    return this.jobSeekerService.findAllProfiles(query);
  }

  @Get('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Job seeker profile retrieved successfully')
  findMyProfile(@ActiveUser('sub') jobSeekerId: string) {
    return this.jobSeekerService.findMyProfile(jobSeekerId);
  }

  @Get(':id')
  @ResponseMessage('Job seeker profile retrieved successfully')
  async findProfileById(@Param('id') id: string) {
    return this.jobSeekerService.findProfileById(id);
  }

  @Delete('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Job seeker deactivated successfully')
  async deactivate(@ActiveUser('email') email: string) {
    return this.jobSeekerService.deactivate(email);
  }

  @Patch('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Job seeker profile updated successfully')
  async updateMyProfile(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() updateJobSeekerProfileDto: UpdateJobSeekerProfileDto,
  ) {
    return this.jobSeekerService.updateMyProfile(jobSeekerId, updateJobSeekerProfileDto);
  }

  @Post('/me/profile-image/presigned-url')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Profile image upload URL generated successfully')
  requestProfileImageUploadUrl(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() requestProfileImageUploadDto: RequestProfileImageUploadDto,
  ) {
    return this.jobSeekerService.requestProfileImageUpload(
      jobSeekerId,
      requestProfileImageUploadDto,
    );
  }

  @Post('/me/profile-image/confirm')
  @Auth(AuthType.Bearer)
  @Roles(UserType.JOB_SEEKER)
  @ResponseMessage('Profile image uploaded successfully')
  confirmProfileImageUpload(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() confirmProfileImageUploadDto: ConfirmProfileImageUploadDto,
  ) {
    return this.jobSeekerService.confirmProfileImageUpload(
      jobSeekerId,
      confirmProfileImageUploadDto,
    );
  }
}
