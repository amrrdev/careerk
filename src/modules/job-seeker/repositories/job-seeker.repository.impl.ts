import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CreateJobSeekerData, JobSeeker, UpdateJobSeekerData } from '../types/job-seeker.types';
import { JobSeekerRepository } from './job-seeker.repository';
import {
  JobSeekerProfileFilters,
  PaginatedResult,
  PublicJobSeekerProfile,
  PublicJobSeekerProfileDetails,
} from '../types/job-seeker-profile.types';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class JobSeekerRepositoryImpl implements JobSeekerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async deactivateByEmail(email: string): Promise<{ id: string } | null> {
    return await this.databaseService.jobSeeker.update({
      where: { email },
      data: { isActive: false },
      select: { id: true },
    });
  }

  async findAllProfiles(
    filters: JobSeekerProfileFilters,
  ): Promise<PaginatedResult<PublicJobSeekerProfile>> {
    const {
      availabilityStatus,
      location,
      workPreference,
      minYearsOfExperience,
      maxYearsOfExperience,
      preferredJobTypes,
      maxNoticePeriod,
      page = 1,
      limit = 20,
    } = filters;

    const where: Prisma.JobSeekerProfileWhereInput = {};
    if (availabilityStatus) where.availabilityStatus = availabilityStatus;
    if (workPreference) where.workPreference = workPreference;
    if (location) where.location = location;
    if (maxNoticePeriod !== undefined) where.noticePeriod = { lte: maxNoticePeriod };
    if (preferredJobTypes?.length) where.preferredJobTypes = { hasSome: preferredJobTypes };
    if (minYearsOfExperience !== undefined || maxYearsOfExperience !== undefined) {
      where.yearsOfExperience = {};
      if (minYearsOfExperience !== undefined) where.yearsOfExperience.gte = minYearsOfExperience;
      if (maxYearsOfExperience !== undefined) where.yearsOfExperience.lte = maxYearsOfExperience;
    }

    const [jobSeekers, total] = await this.databaseService.$transaction([
      this.databaseService.jobSeekerProfile.findMany({
        where,
        omit: {
          id: true,
          expectedSalary: true,
          cvEmail: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          summary: true,
          noticePeriod: true,
          linkedinUrl: true,
          portfolioUrl: true,
          githubUrl: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { yearsOfExperience: 'desc' },
      }),

      this.databaseService.jobSeekerProfile.count({ where }),
    ]);

    return {
      jobSeekers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findProfileById(jobSeekerId: string): Promise<PublicJobSeekerProfileDetails | null> {
    return this.databaseService.jobSeekerProfile.findUnique({
      where: { jobSeekerId },
      omit: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmailAndUpdatePassword(
    email: string,
    password: string,
  ): Promise<{ id: string } | null> {
    try {
      return await this.databaseService.jobSeeker.update({
        where: { email },
        data: { password },
        select: { id: true },
      });
    } catch {
      return null;
    }
  }

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
