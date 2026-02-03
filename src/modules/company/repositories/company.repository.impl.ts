import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyData, Company, UpdateCompanyData } from '../types/company.types';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmailAndUpdate(email: string, data: UpdateCompanyData): Promise<Company | null> {
    return this.databaseService.company.update({
      where: { email },
      data,
    });
  }

  async create(data: CreateCompanyData): Promise<Company> {
    return this.databaseService.company.create({ data });
  }

  async findByEmail(email: string): Promise<Company | null> {
    return this.databaseService.company.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<Company | null> {
    return this.databaseService.company.findUnique({ where: { id } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.databaseService.company.findUnique({
      where: { email },
      select: { id: true },
    });
    return result !== null;
  }
}
