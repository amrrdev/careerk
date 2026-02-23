import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CompanyApplicationService } from './application.service';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/modules/iam/enums/auth-type.enum';
import { UserType } from 'src/modules/iam/enums/user-type.enum';
import { Roles } from 'src/modules/iam/authentication/decorators/roles.decorator';
import { ApplicationQueryDto } from './dto/application-query.dto';

@Controller('companies/me/applications')
@Auth(AuthType.Bearer)
@Roles(UserType.COMPANY)
export class CompanyApplicationController {
  constructor(private readonly applicationService: CompanyApplicationService) {}

  @Get()
  @ResponseMessage('Applications retrieved successfully')
  getMyApplications(@ActiveUser('sub') companyId: string, @Query() query: ApplicationQueryDto) {
    return this.applicationService.getCompanyApplications(companyId, query);
  }

  @Get(':id')
  @ResponseMessage('Application retrieved successfully')
  getApplicationById(@ActiveUser('sub') companyId: string, @Param('id') applicationId: string) {
    return this.applicationService.getApplicationById(applicationId, companyId);
  }

  @Patch(':id')
  @ResponseMessage('Application status updated successfully')
  updateApplicationStatus(
    @ActiveUser('sub') companyId: string,
    @Param('id') applicationId: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return this.applicationService.updateApplicationStatus(applicationId, companyId, dto);
  }
}
