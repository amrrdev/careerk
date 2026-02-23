import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyQueryDto } from './dto/company-query.dto';
import { PublicCompanyDetails, MyCompanyProfile } from './types/company.types';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async findAllCompanies(query: CompanyQueryDto) {
    const { page = 1, limit = 20 } = query;
    const result = await this.companyRepository.findAllCompanies(query);

    return {
      companies: result.items,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async findMyProfile(companyId: string): Promise<MyCompanyProfile> {
    const company = await this.companyRepository.findMyProfile(companyId);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findCompanyById(id: string): Promise<PublicCompanyDetails> {
    const company = await this.companyRepository.findCompanyById(id);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async deactivate(email: string): Promise<{ id: string }> {
    const result = await this.companyRepository.deactivateByEmail(email);
    if (!result) throw new NotFoundException('Company not found or already deactivated');
    return { id: result.id };
  }

  async updateMyProfile(
    companyId: string,
    data: UpdateCompanyProfileDto,
  ): Promise<MyCompanyProfile> {
    const updated = await this.companyRepository.updateMyProfile(companyId, data);
    if (!updated) throw new NotFoundException('Failed to update company profile');
    return updated;
  }
}
