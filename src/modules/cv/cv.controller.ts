import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CvService } from './cv.service';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.url.dto';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';

@Controller('cv')
@Roles(UserType.JOB_SEEKER)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('presigned-url')
  requestUploadUrl(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() requestUploadUrlDto: RequestUploadUrlDto,
  ) {
    return this.cvService.requestUploadUrl(jobSeekerId, requestUploadUrlDto);
  }

  @Post('confirm')
  confirmUpload(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() confirmUploadDto: ConfirmUploadDto,
  ) {
    return this.cvService.confirmUpload(jobSeekerId, confirmUploadDto);
  }

  @Get('me')
  getMyCvInfo(@ActiveUser('sub') jobSeekerId: string) {
    return this.cvService.getMyCvInfo(jobSeekerId);
  }

  @Get('me/download-url')
  getMyCvDownloadUrl(@ActiveUser('sub') jobSeekerId: string) {
    return this.cvService.getMyCvDownloadUrl(jobSeekerId);
  }

  @Get('download-url/:jobSeekerId')
  @Auth(AuthType.Bearer)
  @Roles(UserType.COMPANY)
  @ResponseMessage('CV download URL retrieved successfully')
  getCandidateCvDownloadUrl(@Param('jobSeekerId') jobSeekerId: string) {
    return this.cvService.getCandidateCvDownloadUrl(jobSeekerId);
  }

  @Delete('me')
  deleteCv(@ActiveUser('sub') jobSeekerId: string) {
    return this.cvService.deleteCv(jobSeekerId);
  }
}
