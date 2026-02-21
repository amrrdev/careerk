import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { SkillsRepository } from './skills.repository';
import {
  JobSeekerSkillWithName,
  CreateJobSeekerSkillData,
  jobSeekerSkillWithNameSelect,
} from '../types/skills.types';

@Injectable()
export class SkillsRepositoryImpl implements SkillsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByJobSeekerId(jobSeekerId: string): Promise<JobSeekerSkillWithName[]> {
    const skills = await this.databaseService.jobSeekerSkill.findMany({
      where: { jobSeekerId },
      ...jobSeekerSkillWithNameSelect,
      orderBy: { createdAt: 'desc' },
    });

    return skills.map((skill) => ({
      skillId: skill.skillId,
      verified: skill.verified,
      name: skill.skill.name,
    }));
  }

  async findById(skillId: string, jobSeekerId: string): Promise<JobSeekerSkillWithName | null> {
    const result = await this.databaseService.jobSeekerSkill.findUnique({
      where: {
        jobSeekerId_skillId: {
          jobSeekerId,
          skillId,
        },
      },
      ...jobSeekerSkillWithNameSelect,
    });

    if (!result) {
      return null;
    }

    return {
      skillId: result.skillId,
      verified: result.verified,
      name: result.skill.name,
    };
  }

  async findSkillById(skillId: string): Promise<{ id: string; name: string } | null> {
    return this.databaseService.skill.findUnique({
      where: { id: skillId },
      select: { id: true, name: true },
    });
  }

  async findSkillByName(name: string): Promise<{ id: string; name: string } | null> {
    return this.databaseService.skill.findUnique({
      where: { name },
      select: { id: true, name: true },
    });
  }

  async createSkill(name: string): Promise<{ id: string; name: string }> {
    return this.databaseService.skill.create({
      data: { name },
      select: { id: true, name: true },
    });
  }

  async create(data: CreateJobSeekerSkillData): Promise<JobSeekerSkillWithName> {
    const result = await this.databaseService.jobSeekerSkill.create({
      data: {
        jobSeekerId: data.jobSeekerId,
        skillId: data.skillId,
        verified: data.verified ?? false,
      },
      include: { skill: true },
    });

    return {
      skillId: result.skillId,
      verified: result.verified,
      name: result.skill.name,
    };
  }

  async delete(skillId: string, jobSeekerId: string): Promise<void> {
    await this.databaseService.jobSeekerSkill.delete({
      where: {
        jobSeekerId_skillId: {
          jobSeekerId,
          skillId,
        },
      },
    });
  }

  async findExisting(jobSeekerId: string, skillId: string): Promise<JobSeekerSkillWithName | null> {
    const result = await this.databaseService.jobSeekerSkill.findUnique({
      where: {
        jobSeekerId_skillId: {
          jobSeekerId,
          skillId,
        },
      },
      ...jobSeekerSkillWithNameSelect,
    });

    if (!result) {
      return null;
    }

    return {
      skillId: result.skillId,
      verified: result.verified,
      name: result.skill.name,
    };
  }
}
