import { Prisma } from 'generated/prisma/client';
import { UpdateJobSeekerData } from './job-seeker.types';

/**
 * Base JobSeekerProfile type from Prisma
 */
export type JobSeekerProfile = Prisma.JobSeekerProfileGetPayload<object>;

/**
 * JobSeekerProfile without sensitive fields (for public list)
 */
export const publicProfileSelect = {
  select: {
    firstName: true,
    lastName: true,
    profile: {
      select: {
        jobSeekerId: true,
        title: true,
        location: true,
        availabilityStatus: true,
        workPreference: true,
        preferredJobTypes: true,
        yearsOfExperience: true,
        linkedinUrl: true,
        portfolioUrl: true,
        githubUrl: true,
      },
    },
  },
} satisfies Prisma.JobSeekerDefaultArgs;
export type PublicJobSeekerProfile = Prisma.JobSeekerGetPayload<typeof publicProfileSelect>;

export const publicJobSeekerProfileDetails = {
  select: {
    firstName: true,
    lastName: true,
    profileImageUrl: true,
    profile: {
      select: {
        jobSeekerId: true,
        title: true,
        location: true,
        availabilityStatus: true,
        workPreference: true,
        preferredJobTypes: true,
        yearsOfExperience: true,
        linkedinUrl: true,
        portfolioUrl: true,
        githubUrl: true,
        cvEmail: true,
        noticePeriod: true,
        phone: true,
        expectedSalary: true,
        summary: true,
      },
    },
    educations: {
      select: {
        degreeType: true,
        description: true,
        institutionName: true,
        isCurrent: true,
        fieldOfStudy: true,
        endDate: true,
        gpa: true,
        startDate: true,
      },
    },
    workExperiences: {
      select: {
        companyName: true,
        description: true,
        isCurrent: true,
        startDate: true,
        jobTitle: true,
        location: true,
        endDate: true,
      },
    },
    jobSeekerSkills: {
      select: {
        skill: true,
        verified: true,
      },
    },
  },
} satisfies Prisma.JobSeekerDefaultArgs;

export type PublicJobSeekerProfileDetails = Prisma.JobSeekerGetPayload<
  typeof publicJobSeekerProfileDetails
>;

export const myJobSeekerProfileDetails = {
  select: {
    firstName: true,
    lastName: true,
    profileImageUrl: true,
    profile: {
      select: {
        jobSeekerId: true,
        title: true,
        location: true,
        availabilityStatus: true,
        workPreference: true,
        preferredJobTypes: true,
        yearsOfExperience: true,
        linkedinUrl: true,
        portfolioUrl: true,
        githubUrl: true,
        cvEmail: true,
        noticePeriod: true,
        phone: true,
        expectedSalary: true,
        summary: true,
      },
    },
    educations: {
      select: {
        degreeType: true,
        description: true,
        institutionName: true,
        isCurrent: true,
        fieldOfStudy: true,
        endDate: true,
        gpa: true,
        startDate: true,
      },
    },
    workExperiences: {
      select: {
        companyName: true,
        description: true,
        isCurrent: true,
        startDate: true,
        jobTitle: true,
        location: true,
        endDate: true,
      },
    },
    jobSeekerSkills: {
      select: {
        skill: true,
        verified: true,
      },
    },
  },
} satisfies Prisma.JobSeekerDefaultArgs;

export type MyJobSeekerProfileDetails = Prisma.JobSeekerGetPayload<
  typeof myJobSeekerProfileDetails
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

export type UpdateMyProfileData = UpdateJobSeekerData & UpdateJobSeekerProfileData;
