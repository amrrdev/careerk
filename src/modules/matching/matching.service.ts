import { Injectable } from '@nestjs/common';
import { MatchingRepository } from './repository/matching.repository';
import { JobSeekerMatchesQueryDto } from './dto/job-seeker-matches-query.dto';
import { CompanyMatchesQueryDto } from './dto/company-matches-query.dto';
import {
  MatchItem,
  CompanyMatchItem,
  PaginatedResult,
  RawScrapedJobMatch,
  RawDirectJobMatchForJobSeeker,
} from './types/matching.types';

@Injectable()
export class MatchingService {
  constructor(private readonly matchingRepository: MatchingRepository) {}

  /**
   * Convert raw scraped job match to unified MatchItem format
   */
  private fromScrapedMatch(raw: RawScrapedJobMatch): MatchItem {
    return {
      id: raw.id,
      jobId: raw.scrapedJobId,
      jobTitle: raw.scrapedJob.title,
      companyName: raw.scrapedJob.companyName,
      location: raw.scrapedJob.location ?? '',
      matchScore: Number(raw.matchScore ?? 0),
      jobSource: 'SCRAPED',
      createdAt: raw.createdAt,
    };
  }

  /**
   * Convert raw direct job match to unified MatchItem format
   */
  private fromDirectMatch(raw: RawDirectJobMatchForJobSeeker): MatchItem {
    return {
      id: raw.id,
      jobId: raw.directJob.id,
      jobTitle: raw.directJob.title,
      companyName: raw.directJob.company.name,
      location: raw.directJob.location ?? '',
      matchScore: Number(raw.matchScore ?? 0),
      jobSource: 'DIRECT',
      createdAt: raw.createdAt,
    };
  }

  private paginate<T>(items: T[], page: number, limit: number, total?: number): PaginatedResult<T> {
    const startIndex = (page - 1) * limit;
    return {
      matches: items.slice(startIndex, startIndex + limit),
      total: total ?? items.length,
      page,
      limit,
      totalPages: Math.ceil((total ?? items.length) / limit),
    };
  }

  /**
   * Get job matches for a job seeker with filtering and pagination
   * Combines both direct and scraped job matches based on query type
   */
  async getJobSeekerMatches(
    jobSeekerId: string,
    query: JobSeekerMatchesQueryDto,
  ): Promise<PaginatedResult<MatchItem>> {
    const type = query.type ?? 'all';
    const minScore = query.minScore ?? 0;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const matches: MatchItem[] = [];
    let totalCount = 0;

    if (type === 'all' || type === 'direct') {
      const direct = await this.matchingRepository.findDirectJobMatchesForJobSeeker(jobSeekerId);
      const directFiltered = direct
        .filter((m) => Number(m.matchScore ?? 0) >= minScore)
        .map((m) => this.fromDirectMatch(m));
      matches.push(...directFiltered);
      totalCount += await this.matchingRepository.countDirectJobMatchesForJobSeeker(
        jobSeekerId,
        minScore,
      );
    }

    if (type === 'all' || type === 'scraped') {
      const scraped = await this.matchingRepository.findScrapedJobMatchesForJobSeeker(jobSeekerId);
      const scrapedFiltered = scraped
        .filter((m) => Number(m.matchScore ?? 0) >= minScore)
        .map((m) => this.fromScrapedMatch(m));
      matches.push(...scrapedFiltered);
      totalCount += await this.matchingRepository.countScrapedJobMatchesForJobSeeker(
        jobSeekerId,
        minScore,
      );
    }

    matches.sort(
      (a, b) => b.matchScore - a.matchScore || b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return this.paginate(matches, page, limit, totalCount);
  }

  /**
   * Get candidate matches for a company's job posting
   * Includes filtering by availability status and minimum score
   */
  async getCompanyJobMatches(
    companyId: string,
    jobId: string,
    query: CompanyMatchesQueryDto,
  ): Promise<PaginatedResult<CompanyMatchItem>> {
    const minScore = query.minScore ?? 0;
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const availabilityStatus = query.availabilityStatus;

    const raw = await this.matchingRepository.findDirectJobMatchesForCompany(companyId, jobId);

    let matches: CompanyMatchItem[] = raw.map((m) => ({
      id: m.id,
      jobSeekerId: m.jobSeeker.id,
      jobSeekerName: `${m.jobSeeker.firstName} ${m.jobSeeker.lastName}`,
      jobSeekerTitle: m.jobSeeker.profile?.title ?? '',
      availabilityStatus: m.jobSeeker.profile?.availabilityStatus ?? '',
      location: m.jobSeeker.profile?.location ?? '',
      matchScore: Number(m.matchScore ?? 0),
      createdAt: m.createdAt,
    }));

    if (availabilityStatus) {
      matches = matches.filter((m) => m.availabilityStatus === availabilityStatus);
    }

    matches = matches.filter((m) => m.matchScore >= minScore);
    matches.sort(
      (a, b) => b.matchScore - a.matchScore || b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const totalCount = await this.matchingRepository.countDirectJobMatchesForCompany(
      companyId,
      jobId,
      minScore,
      availabilityStatus,
    );

    return this.paginate(matches, page, limit, totalCount);
  }
}
