import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SkillsRepository } from './repository/skills.repository';
import { AddSkillsDto } from './dto/add-skills.dto';
import { JobSeekerSkillWithName } from './types/skills.types';

@Injectable()
export class SkillsService {
  constructor(private readonly skillsRepository: SkillsRepository) {}

  async findAll(jobSeekerId: string): Promise<JobSeekerSkillWithName[]> {
    return this.skillsRepository.findAllByJobSeekerId(jobSeekerId);
  }

  async findById(skillId: string, jobSeekerId: string): Promise<JobSeekerSkillWithName> {
    const skill = await this.skillsRepository.findById(skillId, jobSeekerId);
    if (!skill) {
      throw new NotFoundException('Skill not found in your profile');
    }
    return skill;
  }

  async addSkills(jobSeekerId: string, dto: AddSkillsDto): Promise<JobSeekerSkillWithName[]> {
    const hasSkillIds = dto.skillId || dto.skillIds;
    const hasSkillNames = dto.skillName || dto.skillNames;

    if (!hasSkillIds && !hasSkillNames) {
      throw new BadRequestException(
        'At least one of skillId, skillIds, skillName, or skillNames must be provided',
      );
    }

    const results: JobSeekerSkillWithName[] = [];

    if (hasSkillIds) {
      const skillIdList = dto.skillId ? [dto.skillId] : (dto.skillIds ?? []);

      for (const skillId of skillIdList) {
        const existingSkill = await this.skillsRepository.findSkillById(skillId);

        if (!existingSkill) {
          throw new NotFoundException(`Skill with ID ${skillId} not found in the platform`);
        }

        const existingLink = await this.skillsRepository.findExisting(
          jobSeekerId,
          existingSkill.id,
        );
        if (existingLink) {
          results.push(existingLink);
          continue;
        }

        const created = await this.skillsRepository.create({
          jobSeekerId,
          skillId: existingSkill.id,
          verified: false,
        });
        results.push(created);
      }
    }

    if (hasSkillNames) {
      const skillNameList = dto.skillName ? [dto.skillName] : (dto.skillNames ?? []);

      for (const skillName of skillNameList) {
        let skill = await this.skillsRepository.findSkillByName(skillName);

        if (!skill) {
          skill = await this.skillsRepository.createSkill(skillName);
        }

        const existingLink = await this.skillsRepository.findExisting(jobSeekerId, skill.id);
        if (existingLink) {
          results.push(existingLink);
          continue;
        }

        const created = await this.skillsRepository.create({
          jobSeekerId,
          skillId: skill.id,
          verified: false,
        });
        results.push(created);
      }
    }

    return results;
  }

  async delete(skillId: string, jobSeekerId: string): Promise<void> {
    await this.findById(skillId, jobSeekerId);
    await this.skillsRepository.delete(skillId, jobSeekerId);
  }
}
