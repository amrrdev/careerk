import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { CvService } from './cv.service';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.url.dto';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';

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

  @Get('me/downoad-url')
  getMyCvDownloadUrl(@ActiveUser('sub') jobSeekerId: string) {
    return this.cvService.getMyCvDownloadUrl(jobSeekerId);
  }

  @Delete('me')
  deleteCv(@ActiveUser('sub') jobSeekerId: string) {
    return this.cvService.deleteCv(jobSeekerId);
  }
}
