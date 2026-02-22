import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DirectJobRepository } from './repository/direct-job.repository';
import { transformDirectJob, transformDirectJobs } from './types/direct-jobs.types';
import { CreateDirectJobDto } from './dto/create-direct-job.dto';
import { DirectJobStatusEnum } from 'generated/prisma/enums';
import { UpdateDirectJobDto } from './dto/update-direct-job.dto';

@Injectable()
export class DirectJobService {
  constructor(private readonly directJobRepository: DirectJobRepository) {}

  async findAll(companyId: string) {
    const jobs = await this.directJobRepository.findAllByCompanyId(companyId);
    return transformDirectJobs(jobs);
  }

  async findById(jobId: string, companyId: string) {
    const job = await this.directJobRepository.findById(jobId, companyId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return transformDirectJob(job);
  }

  async create(companyId: string, dto: CreateDirectJobDto) {
    const job = await this.directJobRepository.create(companyId, {
      ...dto,
      status: DirectJobStatusEnum.DRAFT,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
    });
    return transformDirectJob(job);
  }

  async delete(jobId: string, companyId: string): Promise<void> {
    await this.directJobRepository.delete(jobId, companyId);
  }

  async update(jobId: string, companyId: string, dto: UpdateDirectJobDto) {
    const job = await this.directJobRepository.update(jobId, companyId, {
      ...dto,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
    });
    return transformDirectJob(job);
  }

  async publish(jobId: string, companyId: string) {
    const job = await this.directJobRepository.findByIdWithStatus(jobId, companyId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== DirectJobStatusEnum.DRAFT && job.status !== DirectJobStatusEnum.PAUSED) {
      throw new BadRequestException('Only draft or paused jobs can be published');
    }

    const updatedJob = await this.directJobRepository.updateStatus(
      jobId,
      companyId,
      DirectJobStatusEnum.PUBLISHED,
    );
    return transformDirectJob(updatedJob);
  }

  async pause(jobId: string, companyId: string) {
    const job = await this.directJobRepository.findByIdWithStatus(jobId, companyId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== DirectJobStatusEnum.PUBLISHED) {
      throw new BadRequestException('Only published jobs can be paused');
    }

    const updatedJob = await this.directJobRepository.updateStatus(
      jobId,
      companyId,
      DirectJobStatusEnum.PAUSED,
    );
    return transformDirectJob(updatedJob);
  }

  async close(jobId: string, companyId: string) {
    const job = await this.directJobRepository.findByIdWithStatus(jobId, companyId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== DirectJobStatusEnum.PUBLISHED && job.status !== DirectJobStatusEnum.PAUSED) {
      throw new BadRequestException('Only published or paused jobs can be closed');
    }

    const updatedJob = await this.directJobRepository.updateStatus(
      jobId,
      companyId,
      DirectJobStatusEnum.CLOSED,
    );
    return transformDirectJob(updatedJob);
  }
}
