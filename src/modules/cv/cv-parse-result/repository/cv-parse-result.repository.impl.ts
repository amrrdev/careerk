import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  CreateCvParseResultData,
  CvParseResult,
  cvParseResultSelect,
  UpdateCvParseResultData,
} from '../types/cv-parse-result.types';
import { CvParseResultRepository } from './cv-parse-result.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CvParseResultRepositoryImpl implements CvParseResultRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateCvParseResultData): Promise<CvParseResult> {
    return this.databaseService.cvParseResult.create({
      data,
      ...cvParseResultSelect,
    });
  }

  async findById(id: string): Promise<CvParseResult | null> {
    return this.databaseService.cvParseResult.findUnique({
      where: { id },
      ...cvParseResultSelect,
    });
  }

  async findByJobSeekerId(jobSeekerId: string): Promise<CvParseResult | null> {
    return this.databaseService.cvParseResult.findUnique({
      where: { jobSeekerId },
      ...cvParseResultSelect,
    });
  }

  async update(id: string, data: UpdateCvParseResultData): Promise<CvParseResult> {
    return this.databaseService.cvParseResult.update({
      where: { id },
      data,
      ...cvParseResultSelect,
    });
  }

  async deleteByJobSeekerId(jobSeekerId: string): Promise<void> {
    await this.databaseService.cvParseResult.delete({
      where: { jobSeekerId },
    });
  }
}
