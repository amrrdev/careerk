import { Injectable } from '@nestjs/common';
import { CreateJobSeekerData, JobSeeker, UpdateJobSeekerData } from '../types/job-seeker.types';
import {
  JobSeekerProfileFilters,
  MyJobSeekerProfileDetails,
  PaginatedResult,
  PublicJobSeekerProfile,
  PublicJobSeekerProfileDetails,
  UpdateMyProfileData,
} from '../types/job-seeker-profile.types';

@Injectable()
export abstract class JobSeekerRepository {
  abstract create(data: CreateJobSeekerData): Promise<JobSeeker>;
  abstract findByEmail(email: string): Promise<JobSeeker | null>;
  abstract findById(id: string): Promise<JobSeeker | null>;
  abstract existsByEmail(email: string): Promise<boolean>;

  abstract findByEmailAndUpdate(
    email: string,
    data: UpdateJobSeekerData,
  ): Promise<JobSeeker | null>;

  abstract findByEmailAndUpdatePassword(
    email: string,
    password: string,
  ): Promise<{ id: string } | null>;

  abstract findAllProfiles(
    filters: JobSeekerProfileFilters,
  ): Promise<PaginatedResult<PublicJobSeekerProfile>>;

  abstract findProfileById(jobSeekerId: string): Promise<PublicJobSeekerProfileDetails | null>;

  abstract deactivateByEmail(email: string): Promise<{ id: string } | null>;

  abstract findMyProfile(jobSeekerId: string): Promise<MyJobSeekerProfileDetails | null>;

  abstract updateMyProfile(jobSeekerId: string, data: UpdateMyProfileData): Promise<void>;
}
