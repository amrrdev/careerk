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
    const { status, search, dateApplied, limit = 20, page = 1 } = filters;
    const where: Prisma.ApplicationWhereInput = {
      jobSeekerId,
    };

    if (status?.length) where.status = { in: status };

    if (search) {
      where.OR = [
        { directJob: { title: { contains: search, mode: 'insensitive' } } },
        { directJob: { description: { contains: search, mode: 'insensitive' } } },
        { directJob: { requirements: { contains: search, mode: 'insensitive' } } },
        { directJob: { responsibilities: { contains: search, mode: 'insensitive' } } },
        { directJob: { company: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (dateApplied && dateApplied !== 'All time') {
      const now = Date.now();
      const ms =
        dateApplied === 'Last 24 hours'
          ? 86_400_000
          : dateApplied === 'Last 7 days'
            ? 604_800_000
            : 2_592_000_000;
      where.appliedAt = { gte: new Date(now - ms) };
    }

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

  async findDirectJobMatch(jobSeekerId: string, directJobId: string) {
    return this.databaseService.directJobMatch.findUnique({
      where: { directJobId_jobSeekerId: { directJobId, jobSeekerId } },
      select: { matchScore: true },
    });
  }

  async findDirectJobMatches(
    pairs: { jobSeekerId: string; directJobId: string }[],
  ): Promise<Map<string, number>> {
    if (pairs.length === 0) return new Map();

    const matches = await this.databaseService.directJobMatch.findMany({
      where: {
        OR: pairs.map(({ jobSeekerId, directJobId }) => ({
          jobSeekerId,
          directJobId,
        })),
      },
      select: { jobSeekerId: true, directJobId: true, matchScore: true },
    });

    const map = new Map<string, number>();
    for (const m of matches) {
      map.set(`${m.jobSeekerId}:${m.directJobId}`, Number(m.matchScore));
    }
    return map;
  }
}
