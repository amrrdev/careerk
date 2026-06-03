import { JobSourceEnum, Prisma } from 'generated/prisma/client';
import { DirectJob, ScrapedJob, PaginatedJobs, JobFilters } from '../types/jobs.types';
import { JobRepository } from './job.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { Injectable } from '@nestjs/common';
import {
  CreateBookmarkData,
  bookmarkWithDetailsSelect,
  BookmarkWithDetails,
} from '../types/bookmark.types';

@Injectable()
export class JobRepositoryImpl implements JobRepository {
  private readonly SKILL_SELECT = { include: { skill: { select: { id: true, name: true } } } };

  // Edited: include industry in company response
  private readonly COMPANY_SELECT = {
    select: {
      id: true,
      name: true,
      logoUrl: true,
      industry: true,
    },
  };

  constructor(private readonly databaseService: DatabaseService) {}

  async findDirectJobByIds(jobIds: string[]): Promise<DirectJob[]> {
    if (jobIds.length === 0) return [];

    const jobs = await this.databaseService.directJob.findMany({
      where: {
        id: { in: jobIds },
        status: 'PUBLISHED',
      },
      include: {
        company: this.COMPANY_SELECT,
        skills: this.SKILL_SELECT,

        // ADDED: required for applicants count mapping
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return jobs.map(this.transformDirectJob);
  }

  async findScrapedJobByIds(jobIds: string[]): Promise<ScrapedJob[]> {
    if (jobIds.length === 0) return [];

    const jobs = await this.databaseService.scrapedJob.findMany({
      where: {
        id: { in: jobIds },
      },
      include: {
        skills: this.SKILL_SELECT,
      },
    });

    return jobs.map(this.transformScrapedJob);
  }

  async createBookmark(jobSeekerId: string, data: CreateBookmarkData): Promise<{ id: string }> {
    return this.databaseService.jobBookmark.upsert({
      where: {
        jobSeekerId_jobId_jobSource: {
          jobSeekerId,
          jobId: data.jobId,
          jobSource: data.jobSource,
        },
      },
      create: { ...data, jobSeekerId },
      update: {},
      select: { id: true },
    });
  }

  async deleteBookmark(jobSeekerId: string, bookmarkId: string): Promise<void> {
    await this.databaseService.jobBookmark.deleteMany({
      where: { id: bookmarkId, jobSeekerId },
    });
  }

  async findBookmarksByJobSeeker(jobSeekerId: string): Promise<BookmarkWithDetails[]> {
    return this.databaseService.jobBookmark.findMany({
      where: { jobSeekerId },
      ...bookmarkWithDetailsSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteBookmarksByJobId(jobId: string, source: JobSourceEnum): Promise<void> {
    await this.databaseService.jobBookmark.deleteMany({
      where: { jobId, jobSource: source },
    });
  }

  async findPublishedDirectJobs(filters: JobFilters): Promise<PaginatedJobs> {
    const {
      page = 1,
      limit = 20,
      search,
      jobType,
      workPreference,
      location,
      experienceLevel,
      salaryMin,
      salaryMax,
    } = filters;

    const where: Prisma.DirectJobWhereInput = { status: 'PUBLISHED' };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (jobType) where.jobType = jobType;
    if (workPreference) where.workPreference = workPreference;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (experienceLevel) where.experienceLevel = experienceLevel;

    if (salaryMin || salaryMax) {
      where.AND = [
        ...(salaryMin ? [{ salaryMax: { gte: salaryMin } }] : []),
        ...(salaryMax ? [{ salaryMin: { lte: salaryMax } }] : []),
      ];
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.databaseService.directJob.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          company: this.COMPANY_SELECT,
          skills: this.SKILL_SELECT,

          // ADDED: required for applicants mapping (avoid TS error + ensure 0 fallback works)
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      this.databaseService.directJob.count({ where }),
    ]);

    return {
      jobs: jobs.map(this.transformDirectJob),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findScrapedJobs(filters: JobFilters): Promise<PaginatedJobs> {
    const { page = 1, limit = 20, search, jobType, location } = filters;

    const where: Prisma.ScrapedJobWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (jobType) where.jobType = jobType;
    if (location) where.location = { contains: location, mode: 'insensitive' };

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      this.databaseService.scrapedJob.findMany({
        where,
        skip,
        take: limit,
        orderBy: { postedAt: 'desc' },
        include: {
          skills: this.SKILL_SELECT,
        },
      }),
      this.databaseService.scrapedJob.count({ where }),
    ]);

    return {
      jobs: jobs.map(this.transformScrapedJob),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Edited: added applicants count support

  async findDirectJobById(jobId: string): Promise<DirectJob | null> {
    const job = await this.databaseService.directJob.findUnique({
      where: {
        id: jobId,
        status: 'PUBLISHED',
      },
      include: {
        company: this.COMPANY_SELECT,
        skills: this.SKILL_SELECT,

        // Edited: include applications count from Prisma relation
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    return job ? this.transformDirectJob(job) : null;
  }

  async findScrapedJobById(jobId: string): Promise<ScrapedJob | null> {
    const job = await this.databaseService.scrapedJob.findUnique({
      where: { id: jobId },
      include: {
        skills: this.SKILL_SELECT,
      },
    });

    return job ? this.transformScrapedJob(job) : null;
  }

  // Edited: transform DirectJob + applicants field added + industry field in company

  private transformDirectJob = (
    job: Prisma.DirectJobGetPayload<{
      include: {
        company: {
          select: {
            id: true;
            name: true;
            logoUrl: true;
            industry: true;
          };
        };
        skills: { include: { skill: { select: { name: true; id: true } } } };

        // Added: Prisma applications count
        _count: {
          select: {
            applications: true;
          };
        };
      };
    }>,
  ): DirectJob => ({
    id: job.id,
    type: 'direct',

    title: job.title,
    description: job.description,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    location: job.location,

    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,

    jobType: job.jobType,
    workPreference: job.workPreference,
    experienceLevel: job.experienceLevel,

    company: {
      id: job.company?.id || null,
      name: job.company?.name || null,
      logoUrl: job.company?.logoUrl || null,
      industry: job.company?.industry || null,
    },

    publishedAt: job.publishedAt,
    deadline: job.deadline ?? null,

    // applicants count from DB relation
    applicants: job._count?.applications ?? 0,

    skills: job.skills.map((s) => ({
      skillId: s.skill.id,
      name: s.skill.name,
    })),
  });

  private transformScrapedJob = (
    job: Prisma.ScrapedJobGetPayload<{
      include: { skills: { include: { skill: { select: { id: true; name: true } } } } };
    }>,
  ): ScrapedJob => ({
    id: job.id,
    //ADDED
    type: 'scraped',

    title: job.title,
    description: job.description,
    location: job.location,
    salary: job.salary,
    jobType: job.jobType,
    companyName: job.companyName,
    sourceUrl: job.url,
    postedAt: job.postedAt,
    source: this.extractSource(job.url),

    skills: job.skills.map((s) => ({
      skillId: s.skill.id,
      name: s.skill.name,
    })),
  });

  private extractSource(
    url: string,
  ): 'LinkedIn' | 'Indeed' | 'Glassdoor' | 'Bayt' | 'Wuzzuf' | 'Unknown' {
    if (!url) return 'Unknown';

    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('indeed')) return 'Indeed';
    if (url.includes('glassdoor')) return 'Glassdoor';
    if (url.includes('bayt.com')) return 'Bayt';
    if (url.includes('wuzzuf.net')) return 'Wuzzuf';

    return 'Unknown';
  }
}
