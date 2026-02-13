import { Injectable, NotFoundException } from '@nestjs/common';
import { JobSeekerRepository } from './repositories/job-seeker.repository';
import { JobSeekerQueryDto } from './dto/job-seeker-query.dto';
import { PaginatedResult, PublicJobSeekerProfile } from './types/job-seeker-profile.types';

@Injectable()
export class JobSeekerService {
  constructor(private readonly jobSeekerRepository: JobSeekerRepository) {}

  async findAllProfiles(
    query: JobSeekerQueryDto,
  ): Promise<PaginatedResult<PublicJobSeekerProfile>> {
    const { page = 1, limit = 20 } = query;
    const { jobSeekers, total } = await this.jobSeekerRepository.findAllProfiles(query);

    return {
      jobSeekers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(seekerId: string): Promise<PublicJobSeekerProfile | null> {
    const profile = await this.jobSeekerRepository.findProfileById(seekerId);

    if (!profile) {
      throw new NotFoundException(`Job seeker profile not found`);
    }

    return { ...profile };
  }

  async deactivate(email: string) {
    return await this.jobSeekerRepository.deactivateByEmail(email);
  }
}
