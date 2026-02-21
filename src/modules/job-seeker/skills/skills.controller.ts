import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { AddSkillsDto } from './dto/add-skills.dto';

@Controller('job-seekers/me/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async findAll(@ActiveUser('sub') jobSeekerId: string) {
    return this.skillsService.findAll(jobSeekerId);
  }

  @Post()
  async addSkills(@ActiveUser('sub') jobSeekerId: string, @Body() addSkillsDto: AddSkillsDto) {
    return this.skillsService.addSkills(jobSeekerId, addSkillsDto);
  }

  @Delete(':skillId')
  async delete(@ActiveUser('sub') jobSeekerId: string, @Param('skillId') skillId: string) {
    return this.skillsService.delete(skillId, jobSeekerId);
  }
}
