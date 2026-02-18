import { Injectable } from '@nestjs/common';
import { CreateEducationData, Education, UpdateEducationData } from '../types/education.types';

@Injectable()
export abstract class EducationRepository {
  abstract findAllByJobSeekerId(jobSeekerId: string): Promise<Education[]>;
  abstract findById(educationId: string, jobSeekerId: string): Promise<Education | null>;
  abstract create(jobSeekerId: string, data: CreateEducationData): Promise<Education>;
  abstract update(educationId: string, data: UpdateEducationData): Promise<Education | null>;

  abstract delete(educationId: string): Promise<void | null>;
}
