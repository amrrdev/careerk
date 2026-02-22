import { Injectable } from '@nestjs/common';
import { DirectJobRepository } from './direct-job.repository';
import { DirectJobStatusEnum } from 'generated/prisma/enums';
import {
  DirectJob,
  CreateDirectJobData,
  UpdateDirectJobData,
  directJobSelect,
} from '../types/direct-jobs.types';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class DirectJobRepositoryImpl implements DirectJobRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllByCompanyId(companyId: string): Promise<DirectJob[]> {
    return this.databaseService.directJob.findMany({
      where: { companyId },
      ...directJobSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(jobId: string, companyId: string): Promise<DirectJob | null> {
    return this.databaseService.directJob.findUnique({
      where: { id: jobId, companyId },
      ...directJobSelect,
    });
  }

  async findByIdWithStatus(
    jobId: string,
    companyId: string,
  ): Promise<{ id: string; status: DirectJobStatusEnum } | null> {
    return this.databaseService.directJob.findUnique({
      where: { id: jobId, companyId },
      select: {
        id: true,
        status: true,
      },
    });
  }

  async create(companyId: string, data: CreateDirectJobData): Promise<DirectJob> {
    const { skillNames, ...jobData } = data;

    let skillsCreateData: { create: { skillId: string }[] } | undefined = undefined;
    if (skillNames && skillNames.length > 0) {
      const skillIds: string[] = [];

      for (const skillName of skillNames) {
        const skill = await this.databaseService.skill.upsert({
          where: { name: skillName },
          create: { name: skillName },
          update: {},
          select: { id: true },
        });
        skillIds.push(skill.id);
      }

      skillsCreateData = {
        create: skillIds.map((skillId) => ({ skillId })),
      };
    }

    const job = await this.databaseService.directJob.create({
      data: {
        ...jobData,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        companyId,
        skills: skillsCreateData,
      },
      ...directJobSelect,
    });

    return job;
  }

  async update(jobId: string, companyId: string, data: UpdateDirectJobData): Promise<DirectJob> {
    const { skillNames, ...jobData } = data;

    let skillsUpdateData:
      | { deleteMany: Record<string, never>; create: { skillId: string }[] }
      | undefined = undefined;
    if (skillNames !== undefined) {
      const skillIds: string[] = [];

      for (const skillName of skillNames) {
        const skill = await this.databaseService.skill.upsert({
          where: { name: skillName },
          create: { name: skillName },
          update: {},
          select: { id: true },
        });
        skillIds.push(skill.id);
      }

      skillsUpdateData = {
        deleteMany: {},
        create: skillIds.map((skillId) => ({ skillId })),
      };
    }

    const job = await this.databaseService.directJob.update({
      where: { id: jobId, companyId },
      data: {
        ...jobData,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        skills: skillsUpdateData,
      },
      ...directJobSelect,
    });

    return job;
  }

  async delete(jobId: string, companyId: string): Promise<void> {
    await this.databaseService.directJob.delete({
      where: { id: jobId, companyId },
    });
  }
  async updateStatus(
    jobId: string,
    companyId: string,
    status: DirectJobStatusEnum,
  ): Promise<DirectJob> {
    const updateData = {
      status,
      ...(status === DirectJobStatusEnum.PUBLISHED && {
        publishedAt: new Date(),
      }),
    };

    return this.databaseService.directJob.update({
      where: { id: jobId, companyId },
      data: updateData,
      ...directJobSelect,
    });
  }

  async addSkill(jobId: string, skillId: string): Promise<void> {
    await this.databaseService.directJobSkill.upsert({
      where: { jobId_skillId: { jobId, skillId } },
      create: { jobId, skillId },
      update: {},
    });
  }

  async removeSkill(jobId: string, skillId: string): Promise<void> {
    await this.databaseService.directJobSkill.delete({
      where: { jobId_skillId: { jobId, skillId } },
    });
  }
}
