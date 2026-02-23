import { Injectable } from '@nestjs/common';
import { Company, CreateCompanyData, UpdateCompanyData } from '../types/company.types';
import {
  PublicCompanyListItem,
  PublicCompanyDetails,
  MyCompanyProfile,
  CompanyFilters,
} from '../types/company.types';

@Injectable()
export abstract class CompanyRepository {
  abstract create(data: CreateCompanyData): Promise<Company>;
  abstract findByEmail(email: string): Promise<Company | null>;
  abstract findById(id: string): Promise<Company | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract findByEmailAndUpdate(email: string, data: UpdateCompanyData): Promise<Company | null>;
  abstract findByEmailAndUpdatePassword(email: string, password: string): Promise<Company | null>;

  abstract findAllCompanies(
    filters: CompanyFilters,
  ): Promise<{ items: PublicCompanyListItem[]; total: number }>;

  abstract findCompanyById(id: string): Promise<PublicCompanyDetails | null>;

  abstract deactivateByEmail(email: string): Promise<{ id: string } | null>;

  abstract findMyProfile(companyId: string): Promise<MyCompanyProfile | null>;

  abstract updateMyProfile(
    companyId: string,
    data: UpdateCompanyData,
  ): Promise<MyCompanyProfile | null>;
}
