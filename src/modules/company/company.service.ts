import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MediaStorageService } from 'src/infrastructure/media-storage/media-storage.service';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyQueryDto } from './dto/company-query.dto';
import { PublicCompanyDetails, MyCompanyProfile } from './types/company.types';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { RequestCompanyImageUploadDto } from './dto/request-company-image-upload.dto';
import { ConfirmCompanyImageUploadDto } from './dto/confirm-company-image-upload.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly mediaStorageService: MediaStorageService,
  ) {}

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

  async requestImageUpload(
    companyId: string,
    requestCompanyImageUploadDto: RequestCompanyImageUploadDto,
  ) {
    const key = this.mediaStorageService.buildCompanyLogoKey(
      companyId,
      requestCompanyImageUploadDto.fileName,
    );
    const uploadUrl = await this.mediaStorageService.generateUploadUrl(
      key,
      requestCompanyImageUploadDto.mimeType,
    );

    return {
      uploadUrl,
      key,
      fileUrl: this.mediaStorageService.buildFileUrl(key),
    };
  }

  async confirmImageUpload(
    companyId: string,
    confirmCompanyImageUploadDto: ConfirmCompanyImageUploadDto,
  ) {
    const expectedPrefix = `company-logos/${companyId}/`;
    if (!confirmCompanyImageUploadDto.key.startsWith(expectedPrefix)) {
      throw new BadRequestException('Invalid company image key');
    }

    const exists = await this.mediaStorageService.fileExists(confirmCompanyImageUploadDto.key);
    if (!exists) {
      throw new BadRequestException('File not found in storage, upload may have failed');
    }

    const company = await this.companyRepository.findMyProfile(companyId);
    if (!company) throw new NotFoundException('Company not found');

    const fileUrl = this.mediaStorageService.buildFileUrl(confirmCompanyImageUploadDto.key);
    const existingUrl = company.logoUrl;
    const previousKey =
      existingUrl &&
      existingUrl !== fileUrl &&
      this.mediaStorageService.extractKeyFromFileUrl(existingUrl);

    if (previousKey) {
      await this.mediaStorageService.deleteFile(previousKey);
    }

    const updated = await this.companyRepository.updateMyProfile(companyId, {
      logoUrl: fileUrl,
    });
    if (!updated) throw new NotFoundException('Failed to update company profile');

    return {
      fileUrl,
    };
  }
}
