import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CreateJobSeekerData, JobSeeker, UpdateJobSeekerData } from '../types/job-seeker.types';
import { JobSeekerRepository } from './job-seeker.repository';

@Injectable()
export class JobSeekerRepositoryImpl implements JobSeekerRepository {
  constructor(private readonly databaseService: DatabaseService) {}
  async findByEmailAndUpdate(email: string, data: UpdateJobSeekerData): Promise<JobSeeker | null> {
    try {
      return await this.databaseService.jobSeeker.update({
        where: { email },
        data,
      });
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<JobSeeker | null> {
    return this.databaseService.jobSeeker.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<JobSeeker | null> {
    return this.databaseService.jobSeeker.findUnique({ where: { id } });
  }

  async create(data: CreateJobSeekerData): Promise<JobSeeker> {
    return this.databaseService.jobSeeker.create({ data });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.databaseService.jobSeeker.findUnique({
      where: { email },
      select: { id: true },
    });
    return result !== null;
  }
}
