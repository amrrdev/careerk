import { Injectable } from '@nestjs/common';
import { JobSeekerMatchFilters, MatchingRepository } from './repository/matching.repository';
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

  private normalizeQueryValue(value?: string): string | undefined {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  }

  private buildJobSeekerMatchFilters(
    query: JobSeekerMatchesQueryDto,
    minScore: number,
  ): JobSeekerMatchFilters {
    const filters: JobSeekerMatchFilters = {
      minScore,
      source: this.normalizeQueryValue(query.source),
      search: this.normalizeQueryValue(query.search),
      jobType: query.jobType,
      location: this.normalizeQueryValue(query.location),
      workPreference: query.workPreference,
      experienceLevel: query.experienceLevel,
      salaryMin: query.salaryMin,
      salaryMax: query.salaryMax,
    };

    return filters;
  }

  /**
   * Edited
   * Convert raw scraped job match to unified MatchItem format
   */
  private fromScrapedMatch(raw: RawScrapedJobMatch): MatchItem {
    return {
      id: raw.scrapedJob.id,
      type: 'scraped',

      title: raw.scrapedJob.title,
      description: raw.scrapedJob.description,

      location: raw.scrapedJob.location ?? '',
      salary: raw.scrapedJob.salary,

      jobType: raw.scrapedJob.jobType,

      companyName: raw.scrapedJob.companyName,

      sourceUrl: raw.scrapedJob.url,
      source: raw.scrapedJob.source,

      postedAt: raw.scrapedJob.postedAt,

      skills: raw.scrapedJob.skills.map((s) => ({
        skillId: s.skill.id,
        name: s.skill.name,
      })),

      matchScore: Number(raw.matchScore ?? 0),
    };
  }

  /**
   * Edited
   * Convert raw direct job match to unified MatchItem format
   */
  private fromDirectMatch(raw: RawDirectJobMatchForJobSeeker): MatchItem {
    return {
      id: raw.directJob.id,
      type: 'direct',

      title: raw.directJob.title,
      description: raw.directJob.description,
      requirements: raw.directJob.requirements,
      responsibilities: raw.directJob.responsibilities,

      location: raw.directJob.location ?? '',

      salaryMin: raw.directJob.salaryMin,
      salaryMax: raw.directJob.salaryMax,

      jobType: raw.directJob.jobType,
      workPreference: raw.directJob.workPreference,
      experienceLevel: raw.directJob.experienceLevel,

      company: {
        id: raw.directJob.company.id,
        name: raw.directJob.company.name,
        logoUrl: raw.directJob.company.logoUrl,
        industry: raw.directJob.company.industry,
      },

      publishedAt: raw.directJob.publishedAt,

      applicants: raw.directJob.applications.length,

      skills: raw.directJob.skills.map((s) => ({
        skillId: s.skill.id,
        name: s.skill.name,
      })),

      matchScore: Number(raw.matchScore ?? 0),
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
    const minScore = Math.max(query.minScore ?? 0, 50);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filters = this.buildJobSeekerMatchFilters(query, minScore);

    const matches: MatchItem[] = [];
    let totalCount = 0;

    if (type === 'all' || type === 'direct') {
      const [direct, directCount] = await Promise.all([
        this.matchingRepository.findDirectJobMatchesForJobSeeker(jobSeekerId, filters),
        this.matchingRepository.countDirectJobMatchesForJobSeeker(jobSeekerId, filters),
      ]);

      matches.push(...direct.map((match) => this.fromDirectMatch(match)));
      totalCount += directCount;
    }

    if (type === 'all' || type === 'scraped') {
      const [scraped, scrapedCount] = await Promise.all([
        this.matchingRepository.findScrapedJobMatchesForJobSeeker(jobSeekerId, filters),
        this.matchingRepository.countScrapedJobMatchesForJobSeeker(jobSeekerId, filters),
      ]);

      matches.push(...scraped.map((match) => this.fromScrapedMatch(match)));
      totalCount += scrapedCount;
    }
    // NOTE:
    // We are merging two different job sources (DIRECT + SCRAPED)
    // Each source has a different date field:
    // - Direct jobs use "publishedAt"
    // - Scraped jobs use "postedAt"

    matches.sort((a, b) => {
      const dateA =
        a.type === 'direct' ? (a.publishedAt?.getTime() ?? 0) : (a.postedAt?.getTime() ?? 0);

      const dateB =
        b.type === 'direct' ? (b.publishedAt?.getTime() ?? 0) : (b.postedAt?.getTime() ?? 0);

      return b.matchScore - a.matchScore || dateB - dateA;
    });

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
