import { Injectable } from '@nestjs/common';
import { Company, CreateCompanyData, UpdateCompanyData } from '../types/company.types';

@Injectable()
export abstract class CompanyRepository {
  abstract create(data: CreateCompanyData): Promise<Company>;
  abstract findByEmail(email: string): Promise<Company | null>;
  abstract findById(id: string): Promise<Company | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract findByEmailAndUpdate(email: string, data: UpdateCompanyData): Promise<Company | null>;
  abstract findByEmailAndUpdatePassword(email: string, password: string): Promise<Company | null>;
}
