import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  DirectJobNotificationTarget,
  MatchingRepository,
  ScrapedJobNotificationTarget,
} from './matching.repository';
import { directJobNotificationSelect, scrapedJobNotificationSelect } from '../types/matching.types';

@Injectable()
export class MatchingRepositoryImpl implements MatchingRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findDirectJobNotificationTarget(
    jobId: string,
  ): Promise<DirectJobNotificationTarget | null> {
    const job = await this.databaseService.directJob.findUnique({
      where: { id: jobId },
      ...directJobNotificationSelect,
    });

    if (!job?.company || !job.company.isActive) {
      return null;
    }

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
            {
              jobSeekerNotificationPreference: {
                is: null,
              },
            },
            {
              jobSeekerNotificationPreference: {
                is: {
                  jobMatchNotificationsEnabled: true,
                },
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
}
