import { Injectable } from '@nestjs/common';
import {
  CreateWorkExperienceData,
  UpdateWorkExperienceData,
  WorkExperience,
} from '../types/work-experience.types';

@Injectable()
export abstract class WorkExperienceRepository {
  abstract findAllByJobSeekerId(jobSeekerId: string): Promise<WorkExperience[]>;
  abstract findById(workExperienceId: string, jobSeekerId: string): Promise<WorkExperience | null>;
  abstract update(
    workExperienceId: string,
    data: UpdateWorkExperienceData,
  ): Promise<WorkExperience | null>;
  abstract create(jobSeekerId: string, data: CreateWorkExperienceData): Promise<WorkExperience>;
  abstract delete(workExperienceId: string): Promise<void | null>;
}
