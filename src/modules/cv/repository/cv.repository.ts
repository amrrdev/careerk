import { Injectable } from '@nestjs/common';
import { CreateCvData, CvDownload, CvInfo, CvKey } from '../types/cv.types';

@Injectable()
export abstract class CvRepository {
  abstract findKeyByJobSeekerId(jobSeekerId: string): Promise<CvKey | null>;
  abstract findInfoByJobSeekerId(jobSeekerId: string): Promise<CvInfo | null>;
  abstract findDownloadByJobSeekerId(jobSeekerId: string): Promise<CvDownload | null>;
  abstract upsert(data: CreateCvData): Promise<void>;
  abstract delete(jobSeekerId: string): Promise<void>;
}
