import { Prisma } from 'generated/prisma/client';

/**
 * Base JobSeekerProfile type from Prisma
 */
export type JobSeekerProfile = Prisma.JobSeekerProfileGetPayload<object>;

/**
 * JobSeekerProfile without sensitive fields (for public list)
 */
export type PublicJobSeekerProfile = Omit<
  JobSeekerProfile,
  | 'cvEmail'
  | 'expectedSalary'
  | 'createdAt'
  | 'updatedAt'
  | 'phone'
  | 'id'
  | 'summary'
  | 'noticePeriod'
  | 'githubUrl'
  | 'portfolioUrl'
  | 'linkedinUrl'
>;

export type PublicJobSeekerProfileDetails = Omit<
  JobSeekerProfile,
  'createdAt' | 'updatedAt' | 'id'
>;

/**
 * JobSeekerProfile creation data (without auto-generated fields)
 */
export type CreateJobSeekerProfileData = Omit<JobSeekerProfile, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * JobSeekerProfile update data (all fields optional)
 */
export type UpdateJobSeekerProfileData = Partial<
  Omit<JobSeekerProfile, 'id' | 'jobSeekerId' | 'createdAt' | 'updatedAt' | 'yearsOfExperience'>
>;

/**
 * Filters for querying job seeker profiles
 */
export type JobSeekerProfileFilters = {
  availabilityStatus?: JobSeekerProfile['availabilityStatus'];
  location?: string;
  workPreference?: JobSeekerProfile['workPreference'];
  preferredJobTypes?: JobSeekerProfile['preferredJobTypes'];
  minYearsOfExperience?: number;
  maxYearsOfExperience?: number;
  maxNoticePeriod?: number;
  page?: number;
  limit?: number;
};

/**
 * Paginated result wrapper
 */
export type PaginatedResult<T> = {
  jobSeekers: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
