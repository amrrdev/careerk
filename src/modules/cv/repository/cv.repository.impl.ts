import { Injectable } from '@nestjs/common';
import {
  CvKey,
  CvInfo,
  CvDownload,
  CreateCvData,
  cvKeySelect,
  cvInfoSelect,
  cvDownloadSelect,
} from '../types/cv.types';
import { CvRepository } from './cv.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class CvRespositoryImpl implements CvRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findKeyByJobSeekerId(jobSeekerId: string): Promise<CvKey | null> {
    return this.databaseService.cV.findUnique({
      where: { jobSeekerId },
      ...cvKeySelect,
    });
  }

  async findInfoByJobSeekerId(jobSeekerId: string): Promise<CvInfo | null> {
    return this.databaseService.cV.findUnique({
      where: { jobSeekerId },
      ...cvInfoSelect,
    });
  }

  async findDownloadByJobSeekerId(jobSeekerId: string): Promise<CvDownload | null> {
    return this.databaseService.cV.findUnique({
      where: { jobSeekerId },
      ...cvDownloadSelect,
    });
  }

  async upsert(data: CreateCvData): Promise<void> {
    await this.databaseService.cV.upsert({
      where: { jobSeekerId: data.jobSeekerId },
      update: {
        key: data.key,
        fileName: data.fileName,
        mimeType: data.mimeType,
      },
      create: data,
    });
  }

  async delete(jobSeekerId: string): Promise<void> {
    await this.databaseService.cV.delete({
      where: { jobSeekerId },
    });
  }
}
