import { Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from './repository/job.repository';
import { JobQueryDto } from './dto/job-query.dto';
import { Job, JobFilters, DirectJob, ScrapedJob, PaginatedJobs } from './types/jobs.types';

@Injectable()
export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async findAll(query: JobQueryDto): Promise<PaginatedJobs> {
    const { source = 'all', page = 1, limit = 20 } = query;
    const filters: JobFilters = { ...query };

    if (source === 'direct') {
      return this.jobRepository.findPublishedDirectJobs(filters);
    }
    if (source === 'scraped') {
      return this.jobRepository.findScrapedJobs(filters);
    }

    // For 'all', split limit evenly between sources
    const perSource = Math.ceil(limit / 2);

    const [directJobs, scrapedJobs] = await Promise.all([
      this.jobRepository.findPublishedDirectJobs({ ...filters, page: 1, limit: perSource }),
      this.jobRepository.findScrapedJobs({ ...filters, page: 1, limit: perSource }),
    ]);

    const mergedJobs: Job[] = [...directJobs.jobs, ...scrapedJobs.jobs]
      .sort((a, b) => {
        const dateA = a.postedAt?.getTime() || 0;
        const dateB = b.postedAt?.getTime() || 0;
        return dateB - dateA;
      })
      .slice(0, limit);

    return {
      jobs: mergedJobs,
      total: directJobs.total + scrapedJobs.total,
      page,
      limit,
      totalPages: Math.ceil((directJobs.total + scrapedJobs.total) / limit),
    };
  }

  async findDirectJobById(jobId: string): Promise<DirectJob> {
    const job = await this.jobRepository.findDirectJobById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async findScrapedJobById(jobId: string): Promise<ScrapedJob> {
    const job = await this.jobRepository.findScrapedJobById(jobId);
    if (!job) {
      throw new NotFoundException('Scraped job not found');
    }
    return job;
  }
}
