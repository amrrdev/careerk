import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import type { MatchingRepository } from './matching.repository';
import type {
  DirectJobNotificationTarget,
  JobSeekerMatchFilters,
  ScrapedJobNotificationTarget,
} from './matching.repository';
import type {
  RawDirectJobMatchForJobSeeker,
  RawScrapedJobMatch,
  RawDirectJobMatchForCompany,
} from '../types/matching.types';
import {
  directJobNotificationSelect,
  scrapedJobNotificationSelect,
  rawDirectJobMatchForJobSeekerSelect,
  rawScrapedJobMatchSelect,
  rawDirectJobMatchForCompanySelect,
} from '../types/matching.types';
import { AvailabilityStatusEnum, Prisma } from 'generated/prisma/client';

@Injectable()
export class MatchingRepositoryImpl implements MatchingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private buildDirectJobMatchesWhere(
    jobSeekerId: string,
    filters: JobSeekerMatchFilters,
  ): Prisma.DirectJobMatchWhereInput {
    const {
      minScore,
      search,
      jobType,
      location,
      workPreference,
      experienceLevel,
      salaryMin,
      salaryMax,
    } = filters;

    const directJobWhere: Prisma.DirectJobWhereInput = {};

    if (search) {
      directJobWhere.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { requirements: { contains: search, mode: 'insensitive' } },
        { responsibilities: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
        {
          skills: {
            some: {
              skill: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    if (jobType && jobType.length > 0) directJobWhere.jobType = { in: jobType };
    if (location) directJobWhere.location = { contains: location, mode: 'insensitive' };
    if (workPreference && workPreference.length > 0)
      directJobWhere.workPreference = { in: workPreference };
    if (experienceLevel && experienceLevel.length > 0)
      directJobWhere.experienceLevel = { in: experienceLevel };

    const salaryFilters: Prisma.DirectJobWhereInput[] = [];
    if (salaryMin !== undefined) {
      salaryFilters.push({ salaryMax: { gte: salaryMin } });
    }
    if (salaryMax !== undefined) {
      salaryFilters.push({ salaryMin: { lte: salaryMax } });
    }
    if (salaryFilters.length > 0) {
      directJobWhere.AND = salaryFilters;
    }

    return {
      jobSeekerId,
      matchScore: { gte: minScore },
      ...(Object.keys(directJobWhere).length > 0 && {
        directJob: directJobWhere,
      }),
    };
  }

  private buildScrapedJobMatchesWhere(
    jobSeekerId: string,
    filters: JobSeekerMatchFilters,
  ): Prisma.ScrapedJobMatchWhereInput {
    const { minScore, source, search, jobType, location } = filters;

    const scrapedJobWhere: Prisma.ScrapedJobWhereInput = {};

    if (source && source.length > 0) {
      scrapedJobWhere.source = { in: source };
    }

    if (search) {
      scrapedJobWhere.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        {
          skills: {
            some: {
              skill: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    if (jobType && jobType.length > 0) scrapedJobWhere.jobType = { in: jobType };
    if (location) scrapedJobWhere.location = { contains: location, mode: 'insensitive' };

    return {
      jobSeekerId,
      matchScore: { gte: minScore },
      ...(Object.keys(scrapedJobWhere).length > 0 && {
        scrapedJob: scrapedJobWhere,
      }),
    };
  }

  // ---------------- Notification Methods ----------------

  async findDirectJobNotificationTarget(
    jobId: string,
  ): Promise<DirectJobNotificationTarget | null> {
    const job = await this.databaseService.directJob.findUnique({
      where: { id: jobId },
      ...directJobNotificationSelect,
    });

    if (!job?.company || !job.company.isActive) return null;

    return {
      companyEmail: job.company.email,
      companyName: job.company.name,
      jobTitle: job.title,
    };
  }

  async findScrapedJobNotificationTargets(
    startedAt: Date,
    finishedAt: Date,
  ): Promise<ScrapedJobNotificationTarget[]> {
    const matches = await this.databaseService.scrapedJobMatch.findMany({
      where: {
        updatedAt: {
          gte: startedAt,
          lte: finishedAt,
        },
        matchScore: {
          gte: 50,
        },
        jobSeeker: {
          isActive: true,
          isVerified: true,
          OR: [
            { jobSeekerNotificationPreference: { is: null } },
            {
              jobSeekerNotificationPreference: {
                is: { jobMatchNotificationsEnabled: true },
              },
            },
          ],
        },
      },
      ...scrapedJobNotificationSelect,
      orderBy: [{ jobSeekerId: 'asc' }, { matchScore: 'desc' }],
    });

    const groupedTargets = new Map<string, ScrapedJobNotificationTarget>();

    for (const match of matches) {
      const existing = groupedTargets.get(match.jobSeekerId);

      if (!existing) {
        groupedTargets.set(match.jobSeekerId, {
          jobSeekerId: match.jobSeekerId,
          email: match.jobSeeker.email,
          firstName: match.jobSeeker.firstName,
          totalMatches: 1,
          topMatches: [
            {
              title: match.scrapedJob.title,
              companyName: match.scrapedJob.companyName,
              location: match.scrapedJob.location,
              matchScore: Number(match.matchScore),
            },
          ],
        });
        continue;
      }

      existing.totalMatches += 1;
      if (existing.topMatches.length < 3) {
        existing.topMatches.push({
          title: match.scrapedJob.title,
          companyName: match.scrapedJob.companyName,
          location: match.scrapedJob.location,
          matchScore: Number(match.matchScore),
        });
      }
    }

    return Array.from(groupedTargets.values());
  }

  // ---------------- Matching Methods ----------------

  async findDirectJobMatchesForJobSeeker(
    jobSeekerId: string,
    filters: JobSeekerMatchFilters,
  ): Promise<RawDirectJobMatchForJobSeeker[]> {
    return this.databaseService.directJobMatch.findMany({
      where: this.buildDirectJobMatchesWhere(jobSeekerId, filters),
      ...rawDirectJobMatchForJobSeekerSelect,
    });
  }

  async findScrapedJobMatchesForJobSeeker(
    jobSeekerId: string,
    filters: JobSeekerMatchFilters,
  ): Promise<RawScrapedJobMatch[]> {
    return this.databaseService.scrapedJobMatch.findMany({
      where: this.buildScrapedJobMatchesWhere(jobSeekerId, filters),
      ...rawScrapedJobMatchSelect,
    });
  }

  async findDirectJobMatchesForCompany(
    companyId: string,
    jobId: string,
  ): Promise<RawDirectJobMatchForCompany[]> {
    return this.databaseService.directJobMatch.findMany({
      where: {
        directJob: {
          id: jobId,
          companyId,
        },
      },
      ...rawDirectJobMatchForCompanySelect,
    });
  }

  async countDirectJobMatchesForJobSeeker(
    jobSeekerId: string,
    filters: JobSeekerMatchFilters,
  ): Promise<number> {
    return this.databaseService.directJobMatch.count({
      where: this.buildDirectJobMatchesWhere(jobSeekerId, filters),
    });
  }

  async countScrapedJobMatchesForJobSeeker(
    jobSeekerId: string,
    filters: JobSeekerMatchFilters,
  ): Promise<number> {
    return this.databaseService.scrapedJobMatch.count({
      where: this.buildScrapedJobMatchesWhere(jobSeekerId, filters),
    });
  }

  async countDirectJobMatchesForCompany(
    companyId: string,
    jobId: string,
    minScore: number,
    availabilityStatus?: AvailabilityStatusEnum,
  ): Promise<number> {
    return this.databaseService.directJobMatch.count({
      where: {
        directJob: {
          id: jobId,
          companyId,
        },
        matchScore: { gte: minScore },
        ...(availabilityStatus && {
          jobSeeker: {
            profile: {
              availabilityStatus,
            },
          },
        }),
      },
    });
  }
}
