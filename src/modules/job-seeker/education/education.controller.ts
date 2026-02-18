import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EducationService } from './education.service';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Controller('job-seekers/me/educations')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll(@ActiveUser('sub') jobSeekerId: string) {
    return this.educationService.findAll(jobSeekerId);
  }

  @Get(':educationId')
  async findById(
    @ActiveUser('sub') jobSeekerId: string,
    @Param('educationId') educationId: string,
  ) {
    return this.educationService.findById(educationId, jobSeekerId);
  }

  @Post()
  async create(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    return this.educationService.create(jobSeekerId, createEducationDto);
  }

  @Patch(':educationId')
  async update(
    @ActiveUser('sub') jobSeekerId: string,
    @Param('educationId') educationId: string,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return this.educationService.update(educationId, jobSeekerId, updateEducationDto);
  }

  @Delete(':educationId')
  async delete(@ActiveUser('sub') jobSeekerId: string, @Param('educationId') educationId: string) {
    return this.educationService.delete(educationId, jobSeekerId);
  }
}
