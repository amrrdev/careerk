import { Injectable } from '@nestjs/common';
import { JobSeekerSkillWithName, CreateJobSeekerSkillData } from '../types/skills.types';

@Injectable()
export abstract class SkillsRepository {
  abstract findAllByJobSeekerId(jobSeekerId: string): Promise<JobSeekerSkillWithName[]>;
  abstract findById(skillId: string, jobSeekerId: string): Promise<JobSeekerSkillWithName | null>;
  abstract findSkillById(skillId: string): Promise<{ id: string; name: string } | null>;
  abstract findSkillByName(name: string): Promise<{ id: string; name: string } | null>;
  abstract createSkill(name: string): Promise<{ id: string; name: string }>;
  abstract create(data: CreateJobSeekerSkillData): Promise<JobSeekerSkillWithName>;
  abstract delete(skillId: string, jobSeekerId: string): Promise<void>;
  abstract findExisting(
    jobSeekerId: string,
    skillId: string,
  ): Promise<JobSeekerSkillWithName | null>;
}
