import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CvRepository } from './repository/cv.repository';
import { CvStorageService } from 'src/infrastructure/cv-storage/cv-stroage.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.url.dto';
import { CreateCvData } from './types/cv.types';

@Injectable()
export class CvService {
  constructor(
    private readonly cvRepository: CvRepository,
    private readonly cvStorageService: CvStorageService,
  ) {}

  async requestUploadUrl(jobSeekerId: string, requestUploadUrlDto: RequestUploadUrlDto) {
    const key = this.cvStorageService.buildKey(jobSeekerId, requestUploadUrlDto.fileName);
    const uploadUrl = await this.cvStorageService.generateUploadUrl(
      key,
      requestUploadUrlDto.mimeType,
    );
    return { uploadUrl, key };
  }

  async confirmUpload(jobSeekerId: string, confirmUploadDto: ConfirmUploadDto) {
    const exists = await this.cvStorageService.fileExists(confirmUploadDto.key);
    if (!exists) {
      throw new BadRequestException('File not found in storage, upload may have failed');
    }

    const existing = await this.cvRepository.findKeyByJobSeekerId(jobSeekerId);

    if (existing && existing.key !== confirmUploadDto.key) {
      await this.cvStorageService.deleteFile(existing.key);
    }

    const data: CreateCvData = {
      jobSeekerId,
      key: confirmUploadDto.key,
      fileName: confirmUploadDto.fileName,
      mimeType: confirmUploadDto.mimeType,
    };

    await this.cvRepository.upsert(data);
  }

  async getMyCvInfo(jobSeekerId: string) {
    const cv = await this.cvRepository.findInfoByJobSeekerId(jobSeekerId);
    if (!cv) {
      throw new NotFoundException('No CV uploaded yet');
    }
    return cv;
  }

  async getMyCvDownloadUrl(jobSeekerId: string) {
    const cv = await this.cvRepository.findKeyByJobSeekerId(jobSeekerId);
    if (!cv) {
      throw new NotFoundException('No CV uploaded yet');
    }
    const downloadUrl = await this.cvStorageService.generateDownloadUrl(cv.key);
    return {
      downloadUrl,
    };
  }

  // TODO: companies download the cv for seekers they apply on
  // async getCandidateCvDownloadUrl(employerId: string, jobSeekerId: string) {}

  async deleteCv(jobSeekerId: string): Promise<void> {
    const cv = await this.cvRepository.findKeyByJobSeekerId(jobSeekerId);
    if (!cv) throw new NotFoundException('No CV to delete');

    await this.cvStorageService.deleteFile(cv.key);
    await this.cvRepository.delete(jobSeekerId);
  }
}
