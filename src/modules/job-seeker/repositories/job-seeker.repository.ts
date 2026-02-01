import { Injectable } from '@nestjs/common';
import { CreateJobSeekerData, JobSeeker } from '../types/job-seeker.types';

@Injectable()
export abstract class JobSeekerRepository {
  abstract create(data: CreateJobSeekerData): Promise<JobSeeker>;
  abstract findByEmail(email: string): Promise<JobSeeker | null>;
  abstract findById(id: string): Promise<JobSeeker | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
}
