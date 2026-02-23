import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  ApplicationFilters,
  PaginatedApplications,
  ApplicationDetail,
  applicationListSelect,
  applicationDetailSelect,
} from '../types/application.types';
import { JobSeekerApplicationRepository } from './application.repository';
import { Prisma } from 'generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobSeekerApplicationRepositoryImpl implements JobSeekerApplicationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createApplication(jobSeekerId: string, directJobId: string): Promise<{ id: string }> {
    return this.databaseService.application.create({
      data: {
        jobSeekerId,
        directJobId,
      },
      select: { id: true },
    });
  }

  async findApplicationsByJobSeeker(
    jobSeekerId: string,
    filters: ApplicationFilters,
  ): Promise<PaginatedApplications> {
    const { status, limit = 20, page = 1 } = filters;
    const where: Prisma.ApplicationWhereInput = {
      jobSeekerId,
    };

    if (status) where.status = status;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.databaseService.application.findMany({
        where,
        ...applicationListSelect,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.databaseService.application.count({ where }),
    ]);

    return {
      applications,
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  findApplicationById(
    jobSeekerId: string,
    applicationId: string,
  ): Promise<ApplicationDetail | null> {
    return this.databaseService.application.findFirst({
      where: {
        id: applicationId,
        jobSeekerId,
      },
      ...applicationDetailSelect,
    });
  }

  async withdrawApplication(jobSeekerId: string, applicationId: string): Promise<void> {
    await this.databaseService.application.update({
      where: { jobSeekerId, id: applicationId },
      data: {
        status: 'WITHDRAWN',
      },
    });
  }

  async checkExistingApplication(jobSeekerId: string, directJobId: string): Promise<boolean> {
    const count = await this.databaseService.application.count({
      where: {
        jobSeekerId,
        directJobId,
      },
    });
    return count > 0;
  }
}
