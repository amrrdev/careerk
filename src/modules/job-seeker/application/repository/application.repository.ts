import { Injectable } from '@nestjs/common';
import { DirectJobMatch } from 'generated/prisma/client';
import {
  ApplicationDetail,
  ApplicationFilters,
  PaginatedApplications,
} from '../types/application.types';

@Injectable()
export abstract class JobSeekerApplicationRepository {
  abstract createApplication(jobSeekerId: string, directJobId: string): Promise<{ id: string }>;

  abstract findApplicationsByJobSeeker(
    jobSeekerId: string,
    filters: ApplicationFilters,
  ): Promise<PaginatedApplications>;

  abstract findApplicationById(
    jobSeekerId: string,
    applicationId: string,
  ): Promise<ApplicationDetail | null>;

  abstract withdrawApplication(jobSeekerId: string, applicationId: string): Promise<void>;

  abstract checkExistingApplication(jobSeekerId: string, directJobId: string): Promise<boolean>;

  abstract findDirectJobMatch(
    jobSeekerId: string,
    directJobId: string,
  ): Promise<Pick<DirectJobMatch, 'matchScore'> | null>;

  abstract findDirectJobMatches(
    pairs: { jobSeekerId: string; directJobId: string }[],
  ): Promise<Map<string, number>>;
}
