import { Prisma } from 'generated/prisma/client';

/**
 * Base JobSeeker type from Prisma
 */

export type JobSeeker = Prisma.JobSeekerGetPayload<object>;

/**
 * JobSeeker without sensitive fields (for public profiles)
 */
export type PublicJobSeeker = Omit<JobSeeker, 'password' | 'isActive' | 'lastLoginAt'>;

/**
 * JobSeeker creation data (without auto-generated fields)
 */
export type CreateJobSeekerData = Omit<
  JobSeeker,
  'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'profileImageUrl' | 'isActive' | 'isVerified'
>;

/**
 * JobSeeker update data (all fields optional)
 */
export type UpdateJobSeekerData = Partial<
  Pick<JobSeeker, 'firstName' | 'lastName' | 'profileImageUrl' | 'isVerified' | 'lastLoginAt'>
>;

/**
 * JobSeeker update password
 */
export type UpdateJobSeekerPassword = Pick<JobSeeker, 'password'>;

const jobSeekerProfileSelect = {
  omit: {
    id: true,
    phone: true,
    createdAt: true,
    updatedAt: true,
    noticePeriod: true,
  },
  include: {
    jobSeeker: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
  },
} satisfies Prisma.JobSeekerProfileDefaultArgs;

export { jobSeekerProfileSelect };

export type PublicJobSeekerProfile = Prisma.JobSeekerProfileGetPayload<
  typeof jobSeekerProfileSelect
>;
