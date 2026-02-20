import { Injectable } from '@nestjs/common';
import {
  CreateCvParseResultData,
  CvParseResult,
  UpdateCvParseResultData,
} from '../types/cv-parse-result.types';

@Injectable()
export abstract class CvParseResultRepository {
  abstract create(data: CreateCvParseResultData): Promise<CvParseResult>;
  abstract findById(id: string): Promise<CvParseResult | null>;
  abstract findByJobSeekerId(jobSeekerId: string): Promise<CvParseResult | null>;
  abstract update(id: string, data: UpdateCvParseResultData): Promise<CvParseResult>;
  abstract deleteByJobSeekerId(jobSeekerId: string): Promise<void>;
}
