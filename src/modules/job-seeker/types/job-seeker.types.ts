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
  'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'isActive' | 'isVerified' | 'profileImageUrl'
>;

/**
 * JobSeeker update data (all fields optional)
 */
export type UpdateJobSeekerData = Partial<
  Omit<JobSeeker, 'id' | 'password' | 'email' | 'createdAt' | 'updatedAt'>
>;

/**
 * JobSeeker update password
 */
export type UpdateJobSeekerPassword = Pick<JobSeeker, 'password'>;
