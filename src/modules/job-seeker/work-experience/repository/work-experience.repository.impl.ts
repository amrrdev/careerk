import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  WorkExperience,
  UpdateWorkExperienceData,
  CreateWorkExperienceData,
  workExperienceSelect,
} from '../types/work-experience.types';
import { WorkExperienceRepository } from './work-experience.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkExperienceRepositoryImpl implements WorkExperienceRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByJobSeekerId(jobSeekerId: string): Promise<WorkExperience[]> {
    return this.databaseService.workExperience.findMany({
      where: { jobSeekerId },
      ...workExperienceSelect,
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    });
  }

  async findById(workExperienceId: string, jobSeekerId: string): Promise<WorkExperience | null> {
    return this.databaseService.workExperience.findUnique({
      where: { jobSeekerId, id: workExperienceId },
      ...workExperienceSelect,
    });
  }

  async update(
    workExperienceId: string,
    data: UpdateWorkExperienceData,
  ): Promise<WorkExperience | null> {
    try {
      return await this.databaseService.workExperience.update({
        where: { id: workExperienceId },
        data,
        ...workExperienceSelect,
      });
    } catch {
      return null;
    }
  }

  async create(jobSeekerId: string, data: CreateWorkExperienceData): Promise<WorkExperience> {
    return this.databaseService.workExperience.create({
      data: {
        jobSeekerId,
        ...data,
      },
      ...workExperienceSelect,
    });
  }

  async delete(workExperienceId: string): Promise<void | null> {
    try {
      await this.databaseService.workExperience.delete({
        where: { id: workExperienceId },
      });
    } catch {
      return null;
    }
  }
}
