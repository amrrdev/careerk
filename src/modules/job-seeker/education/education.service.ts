import { Injectable, NotFoundException } from '@nestjs/common';
import { EducationRepository } from './repository/education.repository';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { UpdateEducationData } from './types/education.types';

@Injectable()
export class EducationService {
  constructor(private readonly educationRepository: EducationRepository) {}

  async findAll(jobSeekerId: string) {
    return this.educationRepository.findAllByJobSeekerId(jobSeekerId);
  }

  async findById(educationId: string, jobSeekerId: string) {
    const education = await this.educationRepository.findById(educationId, jobSeekerId);
    if (!education) {
      throw new NotFoundException('Education entry not found');
    }
    return education;
  }

  async create(jobSeekerId: string, createEducationDto: CreateEducationDto) {
    return this.educationRepository.create(jobSeekerId, {
      ...createEducationDto,
      startDate: new Date(createEducationDto.startDate),
      endDate: createEducationDto.endDate ? new Date(createEducationDto.endDate) : undefined,
    });
  }

  async update(educationId: string, jobSeekerId: string, updateEducationDto: UpdateEducationDto) {
    await this.findById(educationId, jobSeekerId);

    const data: UpdateEducationData = {};

    if (updateEducationDto.institutionName !== undefined)
      data.institutionName = updateEducationDto.institutionName;
    if (updateEducationDto.degreeType !== undefined)
      data.degreeType = updateEducationDto.degreeType;
    if (updateEducationDto.fieldOfStudy !== undefined)
      data.fieldOfStudy = updateEducationDto.fieldOfStudy;
    if (updateEducationDto.description !== undefined)
      data.description = updateEducationDto.description;
    if (updateEducationDto.gpa !== undefined) data.gpa = updateEducationDto.gpa;
    if (updateEducationDto.isCurrent !== undefined) data.isCurrent = updateEducationDto.isCurrent;
    if (updateEducationDto.startDate !== undefined)
      data.startDate = new Date(updateEducationDto.startDate);
    if (updateEducationDto.endDate !== undefined)
      data.endDate = updateEducationDto.endDate ? new Date(updateEducationDto.endDate) : undefined;

    return this.educationRepository.update(educationId, data);
  }

  async delete(educationId: string, jobSeekerId: string) {
    await this.findById(educationId, jobSeekerId);
    await this.educationRepository.delete(educationId);
  }
}
