import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyQueryDto } from './dto/company-query.dto';
import { UpdateCompanyData, PublicCompany } from './types/company.types';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  // Fetch all companies with pagination and filters
  async findAllCompanies(query: CompanyQueryDto) {
    const { page = 1, limit = 20 } = query;

    const result = await this.companyRepository.findAllCompanies(query);

    const companies: PublicCompany[] = result.items.map(
      ({ password, email, isActive, isVerified, createdAt, updatedAt, ...rest }) => rest,
    );

    return {
      companies,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  // Fetch the profile of the logged-in company
  async findMyProfile(companyId: string): Promise<PublicCompany> {
    const company = await this.companyRepository.findMyProfile(companyId);
    if (!company) throw new NotFoundException('Company not found');

    const { password, email, isActive, isVerified, createdAt, updatedAt, ...rest } = company;
    return rest;
  }

  // Fetch a company by its ID
  async findCompanyById(id: string): Promise<PublicCompany> {
    const company = await this.companyRepository.findById(id);
    if (!company) throw new NotFoundException('Company not found');

    const { password, email, isActive, isVerified, createdAt, updatedAt, ...rest } = company;
    return rest;
  }

  // Deactivate a company account by email
  async deactivate(email: string): Promise<{ id: string }> {
    const result = await this.companyRepository.deactivateByEmail(email);
    if (!result) throw new NotFoundException('Company not found or already deactivated');
    return { id: result.id };
  }

  // Update the profile of the logged-in company (prevent email & password update)
  async updateMyProfile(
    companyId: string,
    data: Omit<UpdateCompanyData, 'email' | 'password'>,
  ): Promise<PublicCompany> {
    const updated = await this.companyRepository.updateMyProfile(companyId, data);
    if (!updated) throw new NotFoundException('Failed to update company profile');

    const { password, email, isActive, isVerified, createdAt, updatedAt, ...rest } = updated;
    return rest;
  }
}
