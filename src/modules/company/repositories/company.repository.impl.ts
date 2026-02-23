import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CreateCompanyData, Company, UpdateCompanyData } from '../types/company.types';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { Prisma } from 'generated/prisma/client';
import {
  publicCompanySelect,
  publicCompanyDetailsSelect,
  myCompanyProfileSelect,
  PublicCompanyListItem,
  PublicCompanyDetails,
  MyCompanyProfile,
  CompanyFilters,
} from '../types/company.types';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmailAndUpdatePassword(email: string, password: string): Promise<Company | null> {
    return this.databaseService.company
      .update({
        where: { email },
        data: { password },
      })
      .catch(() => null);
  }

  async findByEmailAndUpdate(email: string, data: UpdateCompanyData): Promise<Company | null> {
    return this.databaseService.company
      .update({
        where: { email },
        data,
      })
      .catch(() => null);
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

  async findAllCompanies(
    filters: CompanyFilters,
  ): Promise<{ items: PublicCompanyListItem[]; total: number }> {
    const { page = 1, limit = 20, name, industry, size, type, location, isVerified } = filters;

    const where: Prisma.CompanyWhereInput = {
      isActive: true,
    };

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (industry) where.industry = { contains: industry, mode: 'insensitive' };
    if (size) where.size = size;
    if (type) where.type = type;
    if (location) where.headquartersLocation = { contains: location, mode: 'insensitive' };
    if (isVerified !== undefined) where.isVerified = isVerified;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.databaseService.company.findMany({
        where,
        ...publicCompanySelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.databaseService.company.count({ where }),
    ]);

    return { items, total };
  }

  async findCompanyById(id: string): Promise<PublicCompanyDetails | null> {
    return this.databaseService.company.findUnique({
      where: { id, isActive: true },
      ...publicCompanyDetailsSelect,
    });
  }

  async deactivateByEmail(email: string): Promise<{ id: string } | null> {
    return this.databaseService.company
      .update({
        where: { email },
        data: { isActive: false },
        select: { id: true },
      })
      .catch(() => null);
  }

  async findMyProfile(companyId: string): Promise<MyCompanyProfile | null> {
    return this.databaseService.company.findUnique({
      where: { id: companyId },
      ...myCompanyProfileSelect,
    });
  }

  async updateMyProfile(
    companyId: string,
    data: UpdateCompanyData,
  ): Promise<MyCompanyProfile | null> {
    return this.databaseService.company
      .update({
        where: { id: companyId },
        data,
        ...myCompanyProfileSelect,
      })
      .catch(() => null);
  }
}
