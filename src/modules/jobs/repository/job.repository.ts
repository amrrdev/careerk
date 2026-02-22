import { Injectable } from '@nestjs/common';
import { DirectJob, ScrapedJob, PaginatedJobs, JobFilters } from '../types/jobs.types';
import { BookmarkWithDetails, CreateBookmarkData } from '../types/bookmark.types';
import { JobSourceEnum } from 'generated/prisma/enums';

@Injectable()
export abstract class JobRepository {
  abstract findPublishedDirectJobs(filters: JobFilters): Promise<PaginatedJobs>;
  abstract findScrapedJobs(filters: JobFilters): Promise<PaginatedJobs>;
  abstract findDirectJobById(jobId: string): Promise<DirectJob | null>;
  abstract findScrapedJobById(jobId: string): Promise<ScrapedJob | null>;

  abstract createBookmark(jobSeekerId: string, data: CreateBookmarkData): Promise<{ id: string }>;
  abstract deleteBookmark(jobSeekerId: string, bookmarkId: string): Promise<void>;
  abstract findBookmarksByJobSeeker(jobSeekerId: string): Promise<BookmarkWithDetails[]>;
  abstract deleteBookmarksByJobId(jobId: string, source: JobSourceEnum): Promise<void>;
}
