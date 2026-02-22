import { DirectJobStatusEnum } from 'generated/prisma/enums';
import { CreateDirectJobData, DirectJob, UpdateDirectJobData } from '../types/direct-jobs.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class DirectJobRepository {
  abstract findAllByCompanyId(companyId: string): Promise<DirectJob[]>;

  abstract findById(jobId: string, companyId: string): Promise<DirectJob | null>;

  abstract findByIdWithStatus(
    jobId: string,
    companyId: string,
  ): Promise<{ id: string; status: DirectJobStatusEnum } | null>;

  abstract create(companyId: string, data: CreateDirectJobData): Promise<DirectJob>;

  abstract update(jobId: string, companyId: string, data: UpdateDirectJobData): Promise<DirectJob>;

  abstract delete(jobId: string, companyId: string): Promise<void>;

  abstract updateStatus(
    jobId: string,
    companyId: string,
    status: DirectJobStatusEnum,
  ): Promise<DirectJob>;

  abstract addSkill(jobId: string, skillId: string): Promise<void>;
  abstract removeSkill(jobId: string, skillId: string): Promise<void>;
}
