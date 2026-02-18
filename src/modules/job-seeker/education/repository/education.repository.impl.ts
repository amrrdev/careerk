import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  Education,
  CreateEducationData,
  UpdateEducationData,
  educationSelect,
} from '../types/education.types';
import { EducationRepository } from './education.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EducationRepositoryImpl implements EducationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByJobSeekerId(jobSeekerId: string): Promise<Education[]> {
    return this.databaseService.education.findMany({
      where: { jobSeekerId },
      ...educationSelect,
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    });
  }

  async findById(educationId: string, jobSeekerId: string): Promise<Education | null> {
    return this.databaseService.education.findUnique({
      where: { jobSeekerId, id: educationId },
      ...educationSelect,
    });
  }

  async create(jobSeekerId: string, data: CreateEducationData): Promise<Education> {
    return this.databaseService.education.create({
      data: {
        ...data,
        jobSeekerId: jobSeekerId,
      },
      ...educationSelect,
    });
  }

  async update(educationId: string, data: UpdateEducationData): Promise<Education | null> {
    return this.databaseService.education.update({
      where: { id: educationId },
      data,
      ...educationSelect,
    });
  }

  async delete(educationId: string): Promise<void | null> {
    await this.databaseService.education.delete({
      where: { id: educationId },
    });
  }
}
