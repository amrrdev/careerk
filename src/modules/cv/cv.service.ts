import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CvRepository } from './repository/cv.repository';
import { CvStorageService } from 'src/infrastructure/cv-storage/cv-stroage.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.url.dto';
import { CreateCvData } from './types/cv.types';
import { CvParseResultRepository } from './cv-parse-result/repository/cv-parse-result.repository';
import { NlpService } from 'src/infrastructure/nlp/nlp.service';
import { NlpParseCvResponse } from './cv-parse-result/types/cv-parse-result.types';

@Injectable()
export class CvService {
  constructor(
    private readonly cvParseResultRepository: CvParseResultRepository,
    private readonly cvStorageService: CvStorageService,
    private readonly cvRepository: CvRepository,
    private readonly nlpService: NlpService,
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

    const existingParseResult = await this.cvParseResultRepository.findByJobSeekerId(jobSeekerId);
    if (existingParseResult) {
      await this.cvParseResultRepository.deleteByJobSeekerId(jobSeekerId);
    }

    const parseResult = await this.cvParseResultRepository.create({
      cvKey: confirmUploadDto.key,
      jobSeekerId,
      status: 'PENDING',
    });

    try {
      const cvUrl = await this.cvStorageService.generateDownloadUrl(confirmUploadDto.key);
      const startTime = Date.now();

      const nlpResponse = (await this.nlpService.parseCv({
        cvUrl,
        jobSeekerId,
      })) as NlpParseCvResponse;
      const processingTime = Date.now() - startTime;

      await this.cvParseResultRepository.update(parseResult.id, {
        status: 'COMPLETED',
        parsedData: nlpResponse.data,
        parsedAt: new Date(nlpResponse.parsedAt),
      });

      return {
        status: 'COMPLETED',
        parseResultId: parseResult.id,
        data: this.mapToPreviewFormat(nlpResponse.data),
        processingTime,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';

      await this.cvParseResultRepository.update(parseResult.id, {
        status: 'FAILED',
        errorMessage: message,
      });

      throw new BadRequestException(
        'Failed to parse CV. Please ensure the file is valid and try again.',
      );
    }
  }

  private mapToPreviewFormat(parsedData: NlpParseCvResponse['data']) {
    return {
      personalInfo: parsedData.personalInfo,
      title: parsedData.title,
      summary: parsedData.professionalSummary,
      education: parsedData.education,
      workExperience: parsedData.workExperience,
      skills: parsedData.skills.map((s) => ({
        name: s.name,
        verified: true,
      })),
      profile: {
        expectedSalary: parsedData.expectedSalary,
        workPreference: parsedData.workPreference,
        yearsOfExperience: parsedData.yearsOfExperience,
        noticePeriod: parsedData.noticePeriod,
        availabilityStatus: parsedData.availabilityStatus,
      },
    };
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
