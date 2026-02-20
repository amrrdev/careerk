import { Controller, Get, Post, Body } from '@nestjs/common';
import { CvParseService } from './cv-parse.service';
import { ConfirmParsedDataDto } from './dto/confirm-parsed-data.dto';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/enums/auth-type.enum';

@Controller('cv-parse')
@Auth(AuthType.Bearer)
@Roles(UserType.JOB_SEEKER)
export class CvParseController {
  constructor(private readonly cvParseService: CvParseService) {}

  @Get('preview')
  async getPreview(@ActiveUser('sub') jobSeekerId: string) {
    return this.cvParseService.getPreview(jobSeekerId);
  }

  @Post('confirm')
  async confirmParsedData(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() dto: ConfirmParsedDataDto,
  ) {
    return this.cvParseService.confirmAndSave(jobSeekerId, dto);
  }
}
