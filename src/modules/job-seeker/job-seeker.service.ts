import { Injectable, NotFoundException } from '@nestjs/common';
import { JobSeekerRepository } from './repositories/job-seeker.repository';
import { JobSeekerQueryDto } from './dto/job-seeker-query.dto';
import { UpdateJobSeekerProfileDto } from './dto/update-job-seeker-profile.dto';

@Injectable()
export class JobSeekerService {
  constructor(private readonly jobSeekerRepository: JobSeekerRepository) {}

  async findAllProfiles(query: JobSeekerQueryDto) {
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

  async findMyProfile(jobSeekerId: string) {
    const profile = await this.jobSeekerRepository.findProfileById(jobSeekerId);

    if (!profile) {
      throw new NotFoundException(`Job seeker profile not found`);
    }

    return {
      ...profile,
      skills: profile.jobSeekerSkills.map(({ skill, verified }) => ({
        name: skill.name,
        verified,
      })),
      jobSeekerSkills: undefined,
    };
  }

  async findProfileById(jobSeekerId: string) {
    const profile = await this.jobSeekerRepository.findProfileById(jobSeekerId);

    if (!profile) {
      throw new NotFoundException(`Job seeker profile not found`);
    }

    return {
      ...profile,
      skills: profile.jobSeekerSkills.map(({ skill, verified }) => ({
        name: skill.name,
        verified,
      })),
      jobSeekerSkills: undefined,
    };
  }

  async updateMyProfile(jobSeekerId: string, updateJobSeekerProfileDto: UpdateJobSeekerProfileDto) {
    try {
      await this.jobSeekerRepository.updateMyProfile(jobSeekerId, updateJobSeekerProfileDto);
    } catch {
      throw new NotFoundException('Profile not found, please complete your onboarding first');
    }
  }

  async deactivate(email: string) {
    return await this.jobSeekerRepository.deactivateByEmail(email);
  }
}
