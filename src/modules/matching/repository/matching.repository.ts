import {
  RawDirectJobMatchForJobSeeker,
  RawScrapedJobMatch,
  RawDirectJobMatchForCompany,
} from '../types/matching.types';
import { AvailabilityStatusEnum } from 'generated/prisma/client';

export type DirectJobNotificationTarget = {
  companyEmail: string;
  companyName: string;
  jobTitle: string;
};

export type ScrapedJobMatchPreview = {
  title: string;
  companyName: string;
  location: string | null;
  matchScore: number;
};

export type ScrapedJobNotificationTarget = {
  jobSeekerId: string;
  email: string;
  firstName: string;
  totalMatches: number;
  topMatches: ScrapedJobMatchPreview[];
};

export abstract class MatchingRepository {
  // ============= Notification targets =============

  abstract findDirectJobNotificationTarget(
    jobId: string,
  ): Promise<DirectJobNotificationTarget | null>;

  abstract findScrapedJobNotificationTargets(
    startedAt: Date,
    finishedAt: Date,
  ): Promise<ScrapedJobNotificationTarget[]>;

  /**
   * Find all direct job matches for a specific job seeker
   *  Uses specific return type instead of any[]
   * @param jobSeekerId - The ID of the job seeker
   * @returns Array of raw direct job matches
   */
  abstract findDirectJobMatchesForJobSeeker(
    jobSeekerId: string,
  ): Promise<RawDirectJobMatchForJobSeeker[]>;

  /**
   * Find all scraped job matches for a specific job seeker
   *  Uses specific return type instead of any[]
   * @param jobSeekerId - The ID of the job seeker
   * @returns Array of raw scraped job matches
   */
  abstract findScrapedJobMatchesForJobSeeker(jobSeekerId: string): Promise<RawScrapedJobMatch[]>;

  /**
   * Find all candidate matches for a specific job posting
   *  Uses specific return type instead of any[]
   * @param companyId - The ID of the company
   * @param jobId - The ID of the job posting
   * @returns Array of raw candidate matches
   */
  abstract findDirectJobMatchesForCompany(
    companyId: string,
    jobId: string,
  ): Promise<RawDirectJobMatchForCompany[]>;

  /**
   * Count direct job matches for a job seeker with minimum score filter
   * @param jobSeekerId - The ID of the job seeker
   * @param minScore - Minimum match score
   * @returns Total count of matches
   */
  abstract countDirectJobMatchesForJobSeeker(
    jobSeekerId: string,
    minScore: number,
  ): Promise<number>;

  /**
   * Count scraped job matches for a job seeker with minimum score filter
   * @param jobSeekerId - The ID of the job seeker
   * @param minScore - Minimum match score
   * @returns Total count of matches
   */
  abstract countScrapedJobMatchesForJobSeeker(
    jobSeekerId: string,
    minScore: number,
  ): Promise<number>;

  /**
   * Count candidate matches for a company's job posting
   * @param companyId - The ID of the company
   * @param jobId - The ID of the job posting
   * @param minScore - Minimum match score
   * @param availabilityStatus - Optional availability status filter
   * @returns Total count of matches
   */
  abstract countDirectJobMatchesForCompany(
    companyId: string,
    jobId: string,
    minScore: number,
    availabilityStatus?: AvailabilityStatusEnum,
  ): Promise<number>;
}
