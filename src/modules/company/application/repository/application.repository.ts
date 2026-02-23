import { Injectable } from '@nestjs/common';
import {
  ApplicationDetail,
  ApplicationFilters,
  PaginatedApplications,
  UpdateApplicationData,
} from '../types/application.types';

@Injectable()
export abstract class CompanyApplicationRepository {
  abstract findApplicationsByCompanyId(
    companyId: string,
    filters: ApplicationFilters,
  ): Promise<PaginatedApplications>;

  abstract findApplicationById(
    applicationId: string,
    companyId: string,
  ): Promise<ApplicationDetail | null>;

  abstract updateApplication(
    applicationId: string,
    companyId: string,
    data: UpdateApplicationData,
  ): Promise<void>;

  abstract checkExistingApplication(applicationId: string, companyId: string): Promise<boolean>;
  // abstract getApplicationCvKey(applicationId: string, companyId: string): Promise<string | null>;
}
