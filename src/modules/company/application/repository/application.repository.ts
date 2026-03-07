import { Injectable } from '@nestjs/common';
import {
  ApplicationDetail,
  ApplicationFilters,
  ApplicationForStatusUpdate,
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

  abstract findApplicationForStatusUpdate(
    applicationId: string,
    companyId: string,
  ): Promise<ApplicationForStatusUpdate | null>;
  // abstract getApplicationCvKey(applicationId: string, companyId: string): Promise<string | null>;
}
