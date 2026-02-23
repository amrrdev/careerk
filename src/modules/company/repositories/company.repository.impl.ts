import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyData, Company, UpdateCompanyData } from '../types/company.types';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmailAndUpdatePassword(email: string, password: string): Promise<Company | null> {
    const company = await this.databaseService.company
      .update({
        where: { email },
        data: { password },
      })
      .catch(() => null);

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findByEmailAndUpdate(email: string, data: UpdateCompanyData): Promise<Company | null> {
    const company = await this.databaseService.company
      .update({
        where: { email },
        data,
      })
      .catch(() => null);

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(data: CreateCompanyData): Promise<Company> {
    return this.databaseService.company.create({ data });
  }

  async findByEmail(email: string): Promise<Company | null> {
    const company = await this.databaseService.company.findUnique({ where: { email } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.databaseService.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.databaseService.company.findUnique({
      where: { email },
      select: { id: true },
    });
    return result !== null;
  }

  async findAllCompanies(
    filters: Partial<Company> & { page?: number; limit?: number },
  ): Promise<{ items: Company[]; total: number }> {
    const { page = 1, limit = 20, ...whereFilters } = filters;

    const [items, total] = await this.databaseService.$transaction([
      this.databaseService.company.findMany({
        where: whereFilters,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.databaseService.company.count({ where: whereFilters }),
    ]);

    return { items, total };
  }

  async deactivateByEmail(email: string): Promise<{ id: string } | null> {
    const company = await this.databaseService.company
      .update({
        where: { email },
        data: { isActive: false },
        select: { id: true },
      })
      .catch(() => null);

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findMyProfile(companyId: string): Promise<Company | null> {
    const company = await this.databaseService.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async updateMyProfile(companyId: string, data: UpdateCompanyData): Promise<Company | null> {
    const company = await this.databaseService.company
      .update({
        where: { id: companyId },
        data,
      })
      .catch(() => null);

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }
}
