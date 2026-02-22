import { Injectable } from '@nestjs/common';
import { DirectJob, ScrapedJob, PaginatedJobs, JobFilters } from '../types/jobs.types';

@Injectable()
export abstract class JobRepository {
  abstract findPublishedDirectJobs(filters: JobFilters): Promise<PaginatedJobs>;
  abstract findScrapedJobs(filters: JobFilters): Promise<PaginatedJobs>;
  abstract findDirectJobById(jobId: string): Promise<DirectJob | null>;
  abstract findScrapedJobById(jobId: string): Promise<ScrapedJob | null>;
}
