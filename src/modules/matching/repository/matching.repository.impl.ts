import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import type { MatchingRepository } from './matching.repository';
import type {
  DirectJobNotificationTarget,
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
import { AvailabilityStatusEnum } from 'generated/prisma/client';

@Injectable()
export class MatchingRepositoryImpl implements MatchingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

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
  ): Promise<RawDirectJobMatchForJobSeeker[]> {
    return this.databaseService.directJobMatch.findMany({
      where: { jobSeekerId },
      ...rawDirectJobMatchForJobSeekerSelect,
    });
  }

  async findScrapedJobMatchesForJobSeeker(jobSeekerId: string): Promise<RawScrapedJobMatch[]> {
    return this.databaseService.scrapedJobMatch.findMany({
      where: { jobSeekerId },
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

  async countDirectJobMatchesForJobSeeker(jobSeekerId: string, minScore: number): Promise<number> {
    return this.databaseService.directJobMatch.count({
      where: {
        jobSeekerId,
        matchScore: { gte: minScore },
      },
    });
  }

  async countScrapedJobMatchesForJobSeeker(jobSeekerId: string, minScore: number): Promise<number> {
    return this.databaseService.scrapedJobMatch.count({
      where: {
        jobSeekerId,
        matchScore: { gte: minScore },
      },
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
