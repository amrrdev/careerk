import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkExperienceRepository } from './repository/work-experience.repository';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceData } from './types/work-experience.types';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Injectable()
export class WorkExperienceService {
  constructor(private readonly workExperienceRepository: WorkExperienceRepository) {}

  async findAll(jobSeekerId: string) {
    return this.workExperienceRepository.findAllByJobSeekerId(jobSeekerId);
  }

  async findById(workExperienceId: string, jobSeekerId: string) {
    const workExperience = await this.workExperienceRepository.findById(
      workExperienceId,
      jobSeekerId,
    );
    if (!workExperience) {
      throw new NotFoundException('Work experience not found');
    }

    return workExperience;
  }

  async create(jobSeekerId: string, createWorkExperienceDTO: CreateWorkExperienceDto) {
    return this.workExperienceRepository.create(jobSeekerId, {
      ...createWorkExperienceDTO,
      startDate: new Date(createWorkExperienceDTO.startDate),
      endDate: createWorkExperienceDTO.endDate
        ? new Date(createWorkExperienceDTO.endDate)
        : undefined,
    });
  }

  async update(workExperienceId: string, jobSeekerId: string, dto: UpdateWorkExperienceDto) {
    const existing = await this.workExperienceRepository.findById(workExperienceId, jobSeekerId);
    if (!existing) {
      throw new NotFoundException('Work experience not found');
    }

    const data: UpdateWorkExperienceData = {};
    if (dto.companyName) data.companyName = dto.companyName;
    if (dto.description) data.description = dto.description;
    if (dto.jobTitle) data.jobTitle = dto.jobTitle;
    if (dto.location) data.location = dto.location;
    if (dto.isCurrent) data.isCurrent = dto.isCurrent;
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    const result = await this.workExperienceRepository.update(workExperienceId, data);
    return result;
  }

  async delete(workExperienceId: string, jobSeekerId: string) {
    const existing = await this.workExperienceRepository.findById(workExperienceId, jobSeekerId);
    if (!existing) {
      throw new NotFoundException('Work experience not found');
    }

    await this.workExperienceRepository.delete(workExperienceId);
  }
}
