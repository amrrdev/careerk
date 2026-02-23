import { Injectable } from '@nestjs/common';
import {
  ApplicationFilters,
  PaginatedApplications,
  ApplicationDetail,
  UpdateApplicationData,
  applicationListSelect,
  applicationDetailSelect,
} from '../types/application.types';
import { CompanyApplicationRepository } from './application.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CompanyApplicationRepositoryImpl implements CompanyApplicationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findApplicationsByCompanyId(
    companyId: string,
    filters: ApplicationFilters,
  ): Promise<PaginatedApplications> {
    const { jobId, status, page = 1, limit = 20 } = filters;
    const where: Prisma.ApplicationWhereInput = {
      directJob: { companyId },
    };

    if (jobId) where.directJobId = jobId;
    if (status) where.status = status;
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      this.databaseService.application.findMany({
        where,
        ...applicationListSelect,
        skip,
        take: limit,
        orderBy: { appliedAt: 'desc' },
      }),
      this.databaseService.application.count({ where }),
    ]);

    return {
      applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findApplicationById(
    applicationId: string,
    companyId: string,
  ): Promise<ApplicationDetail | null> {
    return this.databaseService.application.findFirst({
      where: {
        id: applicationId,
        directJob: { companyId },
      },
      ...applicationDetailSelect,
    });
  }

  async updateApplication(
    applicationId: string,
    companyId: string,
    data: UpdateApplicationData,
  ): Promise<void> {
    await this.databaseService.application.update({
      where: {
        id: applicationId,
        directJob: { companyId },
      },
      data,
    });
  }

  async checkExistingApplication(applicationId: string, companyId: string): Promise<boolean> {
    const count = await this.databaseService.application.count({
      where: {
        id: applicationId,
        directJob: { companyId },
      },
    });
    return count > 0;
  }

  // getApplicationCvKey(applicationId: string, companyId: string): Promise<string | null> {
  //   throw new Error('Method not implemented.');
  // }
}
