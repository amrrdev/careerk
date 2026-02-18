import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WorkExperienceService } from './work-experience.service';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Controller('job-seekers/me/work-experiences')
export class WorkExperienceController {
  constructor(private readonly workExperienceService: WorkExperienceService) {}

  @Get()
  async findAll(@ActiveUser('sub') jobSeekerId: string) {
    console.log(jobSeekerId);
    return this.workExperienceService.findAll(jobSeekerId);
  }

  @Get(':expId')
  async findById(@ActiveUser('sub') jobSeekerId: string, @Param('expId') workExperienceId: string) {
    return this.workExperienceService.findById(workExperienceId, jobSeekerId);
  }

  @Post()
  async create(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() createWorkExperienceDto: CreateWorkExperienceDto,
  ) {
    return this.workExperienceService.create(jobSeekerId, createWorkExperienceDto);
  }

  @Patch(':expId')
  update(
    @ActiveUser('sub') jobSeekerId: string,
    @Param('expId') workExperienceId: string,
    @Body() createWorkExperienceDto: UpdateWorkExperienceDto,
  ) {
    return this.workExperienceService.update(
      workExperienceId,
      jobSeekerId,
      createWorkExperienceDto,
    );
  }

  @Delete(':expId')
  async delete(@ActiveUser('sub') jobSeekerId: string, @Param('expId') workExperienceId: string) {
    return this.workExperienceService.delete(workExperienceId, jobSeekerId);
  }
}
