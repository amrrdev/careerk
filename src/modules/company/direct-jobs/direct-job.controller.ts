import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DirectJobService } from './direct-job.service';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/modules/iam/enums/auth-type.enum';
import { Roles } from 'src/modules/iam/authentication/decorators/roles.decorator';
import { UserType } from 'src/modules/iam/enums/user-type.enum';
import { CreateDirectJobDto } from './dto/create-direct-job.dto';
import { UpdateDirectJobDto } from './dto/update-direct-job.dto';

@Controller('companies/me/jobs')
@Auth(AuthType.Bearer)
@Roles(UserType.COMPANY)
export class DirectJobController {
  constructor(private readonly directJobService: DirectJobService) {}

  @Get()
  async findAll(@ActiveUser('sub') companyId: string) {
    return this.directJobService.findAll(companyId);
  }

  @Get(':jobId')
  async findById(@ActiveUser('sub') companyId: string, @Param('jobId') jobId: string) {
    return this.directJobService.findById(jobId, companyId);
  }

  @Post()
  async create(
    @ActiveUser('sub') companyId: string,
    @Body() createDirectJobDto: CreateDirectJobDto,
  ) {
    return this.directJobService.create(companyId, createDirectJobDto);
  }

  @Patch(':jobId')
  async update(
    @ActiveUser('sub') companyId: string,
    @Param('jobId') jobId: string,
    @Body() updateDirectJobDto: UpdateDirectJobDto,
  ) {
    return this.directJobService.update(jobId, companyId, updateDirectJobDto);
  }

  @Delete(':jobId')
  async delete(@ActiveUser('sub') companyId: string, @Param('jobId') jobId: string) {
    return this.directJobService.delete(jobId, companyId);
  }

  @Post(':jobId/publish')
  async publish(@ActiveUser('sub') companyId: string, @Param('jobId') jobId: string) {
    return this.directJobService.publish(jobId, companyId);
  }

  @Post(':jobId/pause')
  async pause(@ActiveUser('sub') companyId: string, @Param('jobId') jobId: string) {
    return this.directJobService.pause(jobId, companyId);
  }

  @Post(':jobId/close')
  async close(@ActiveUser('sub') companyId: string, @Param('jobId') jobId: string) {
    return this.directJobService.close(jobId, companyId);
  }
}
