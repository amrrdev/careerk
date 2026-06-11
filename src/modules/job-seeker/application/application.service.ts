import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobSeekerApplicationRepository } from './repository/application.repository';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { JobRepository } from 'src/modules/jobs/repository/job.repository';

@Injectable()
export class JobSeekerApplicationService {
  constructor(
    private readonly applicationRepository: JobSeekerApplicationRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async getMyApplications(jobSeekerId: string, filters: ApplicationQueryDto) {
    const result = await this.applicationRepository.findApplicationsByJobSeeker(
      jobSeekerId,
      filters,
    );

    const pairs = result.applications.map((app) => ({
      jobSeekerId,
      directJobId: app.directJob.id,
    }));

    const matchScores = await this.applicationRepository.findDirectJobMatches(pairs);

    return {
      ...result,
      applications: result.applications.map((app) => ({
        ...app,
        matchScore: matchScores.get(`${jobSeekerId}:${app.directJob.id}`) ?? 0,
      })),
    };
  }

  async getApplicationById(jobSeekerId: string, applicationId: string) {
    const application = await this.applicationRepository.findApplicationById(
      jobSeekerId,
      applicationId,
    );
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const directJobMatch = await this.applicationRepository.findDirectJobMatch(
      jobSeekerId,
      application.directJob.id,
    );

    return {
      ...application,
      matchScore: Number(directJobMatch?.matchScore ?? 0),
    };
  }

  async applyToJob(jobSeekerId: string, jobId: string) {
    const job = await this.jobRepository.findDirectJobById(jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const hasApplied = await this.applicationRepository.checkExistingApplication(
      jobSeekerId,
      jobId,
    );

    if (hasApplied) {
      throw new ConflictException('You have already applied to this job');
    }

    return this.applicationRepository.createApplication(jobSeekerId, jobId);
  }

  async withdrawApplication(jobSeekerId: string, applicationId: string) {
    const application = await this.applicationRepository.findApplicationById(
      jobSeekerId,
      applicationId,
    );

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status === 'WITHDRAWN') {
      throw new BadRequestException('Application is already withdrawn');
    }

    await this.applicationRepository.withdrawApplication(jobSeekerId, applicationId);
  }
}
