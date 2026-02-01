import { Injectable } from '@nestjs/common';
import { Company, CreateCompanyData } from '../types/company.types';

@Injectable()
export abstract class CompanyRepository {
  abstract create(data: CreateCompanyData): Promise<Company>;
  abstract findByEmail(email: string): Promise<Company | null>;
  abstract findById(id: string): Promise<Company | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
}
