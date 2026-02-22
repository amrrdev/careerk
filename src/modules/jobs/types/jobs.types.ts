import { ExperienceLevelEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export type DirectJob = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  responsibilities: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  jobType: JobTypeEnum;
  workPreference: WorkPreferenceEnum;
  experienceLevel: ExperienceLevelEnum | null;
  companyName: string | null;
  companyLogoUrl: string | null;
  postedAt: Date | null;
  source: 'direct';
  skills: { skillId: string; name: string }[];
};

export type ScrapedJob = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  salary: string | null;
  jobType: JobTypeEnum | null;
  companyName: string | null;
  sourceUrl: string | null;
  postedAt: Date | null;
  source: 'scraped';
  skills: { skillId: string; name: string }[];
};

export type Job = DirectJob | ScrapedJob;

export type PaginatedDirectJobs = {
  jobs: DirectJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedScrapedJobs = {
  jobs: ScrapedJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedJobs = {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type JobFilters = {
  source?: 'direct' | 'scraped' | 'all';
  search?: string;
  jobType?: JobTypeEnum;
  workPreference?: WorkPreferenceEnum;
  location?: string;
  experienceLevel?: ExperienceLevelEnum;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
};
