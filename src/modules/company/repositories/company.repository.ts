import { Injectable } from '@nestjs/common';
import { Company, CreateCompanyData, UpdateCompanyData } from '../types/company.types';

/**
 * Abstract repository for Company entity
 */
@Injectable()
export abstract class CompanyRepository {
  // --- Existing methods ---

  abstract create(data: CreateCompanyData): Promise<Company>;
  abstract findByEmail(email: string): Promise<Company | null>;
  abstract findById(id: string): Promise<Company | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract findByEmailAndUpdate(email: string, data: UpdateCompanyData): Promise<Company | null>;
  abstract findByEmailAndUpdatePassword(email: string, password: string): Promise<Company | null>;

  // --- New methods ---

  /**
   * Fetch all companies with filters and pagination
   */
  abstract findAllCompanies(
    filters: Partial<Company> & { page?: number; limit?: number },
  ): Promise<{ items: Company[]; total: number }>;

  /**
   * Deactivate a company account by email
   */
  abstract deactivateByEmail(email: string): Promise<{ id: string } | null>;

  /**
   * Get the profile of the logged-in company
   */
  abstract findMyProfile(companyId: string): Promise<Company | null>;

  /**
   * Update the profile of the logged-in company
   */
  abstract updateMyProfile(companyId: string, data: UpdateCompanyData): Promise<Company | null>;
}
