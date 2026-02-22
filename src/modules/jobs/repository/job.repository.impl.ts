import { Prisma } from 'generated/prisma/client';
import { DirectJob, ScrapedJob, PaginatedJobs, JobFilters } from '../types/jobs.types';
import { JobRepository } from './job.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobRepositoryImpl implements JobRepository {
  private readonly SKILL_SELECT = { include: { skill: { select: { id: true, name: true } } } };
  private readonly COMPANY_SELECT = { select: { name: true, logoUrl: true } };

  constructor(private readonly databaseService: DatabaseService) {}

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

  async findDirectJobById(jobId: string): Promise<DirectJob | null> {
    const job = await this.databaseService.directJob.findUnique({
      where: { id: jobId, status: 'PUBLISHED' },
      include: {
        company: this.COMPANY_SELECT,
        skills: this.SKILL_SELECT,
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

  private transformDirectJob = (
    job: Prisma.DirectJobGetPayload<{
      include: {
        company: { select: { name: true; logoUrl: true } };
        skills: { include: { skill: { select: { name: true; id: true } } } };
      };
    }>,
  ): DirectJob => ({
    id: job.id,
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
    companyName: job.company?.name || null,
    companyLogoUrl: job.company?.logoUrl || null,
    postedAt: job.publishedAt,
    source: 'direct',
    skills: job.skills.map((s) => ({ skillId: s.skill.id, name: s.skill.name })),
  });

  private transformScrapedJob = (
    job: Prisma.ScrapedJobGetPayload<{
      include: { skills: { include: { skill: { select: { id: true; name: true } } } } };
    }>,
  ): ScrapedJob => ({
    id: job.id,
    title: job.title,
    description: job.description,
    location: job.location,
    salary: job.salary,
    jobType: job.jobType,
    companyName: job.companyName,
    sourceUrl: job.url,
    postedAt: job.postedAt,
    source: 'scraped',
    skills: job.skills.map((s) => ({ skillId: s.skill.id, name: s.skill.name })),
  });
}
