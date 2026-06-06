import { ExperienceLevelEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

//Edited to extract the source from the URL
export type JobSource = 'LinkedIn' | 'Indeed' | 'Glassdoor' | 'Bayt' | 'Wuzzuf' | 'Unknown';
export type DirectJob = {
  id: string;

  /* ADDED */
  type: 'direct';

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

  /* CHANGED: replaced companyName + companyLogoUrl with company object */
  company: {
    id: string | null;
    name: string | null;
    logoUrl: string | null;
    industry?: string | null;
  } | null;

  publishedAt: Date | null;
  deadline?: Date | null;
  skills: { skillId: string; name: string }[];
  applicants?: number;
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

  /* ADDED */
  type: 'scraped';

  source: JobSource;
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
