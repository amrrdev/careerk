import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyQueryDto } from './dto/company-query.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { AuthType } from '../iam/enums/auth-type.enum';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { Roles } from '../iam/authentication/decorators/roles.decorator';
import { UserType } from '../iam/enums/user-type.enum';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';

@Controller('companies')
@Auth(AuthType.None)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ResponseMessage('Company profiles retrieved successfully')
  async findAllCompanies(@Query() query: CompanyQueryDto) {
    return this.companyService.findAllCompanies(query);
  }

  @Get('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.COMPANY)
  @ResponseMessage('Company profile retrieved successfully')
  async findMyProfile(@ActiveUser('sub') companyId: string) {
    return this.companyService.findMyProfile(companyId);
  }

  @Get(':id')
  @ResponseMessage('Company profile retrieved successfully')
  async findCompanyById(@Param('id') id: string) {
    return this.companyService.findCompanyById(id);
  }

  @Delete('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.COMPANY)
  @ResponseMessage('Company deactivated successfully')
  async deactivate(@ActiveUser('email') email: string) {
    return this.companyService.deactivate(email);
  }

  @Patch('/me')
  @Auth(AuthType.Bearer)
  @Roles(UserType.COMPANY)
  @ResponseMessage('Company profile updated successfully')
  async updateMyProfile(
    @ActiveUser('sub') companyId: string,
    @Body() updateCompanyProfileDto: UpdateCompanyProfileDto,
  ) {
    return this.companyService.updateMyProfile(companyId, updateCompanyProfileDto);
  }
}
