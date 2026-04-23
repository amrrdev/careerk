import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DirectJobWebhookBodyDto } from '../dto/direct-job.dto';
import {
  MATCHING_EMAIL_QUEUE,
  SEND_DIRECT_MATCHING_EMAIL_JOB,
  SEND_SCRAPED_MATCHING_EMAIL_JOB,
} from '../jobs/queue.constants';
import { SendDirectMatchingEmailJob } from '../jobs/send-direct-matching-email.job';
import { SendScrapedMatchingEmailJob } from '../jobs/send-scraped-matching-email.job';
import { MatchingRepository } from '../repository/matching.repository';
import {
  DirectJobCompletedFailure,
  DirectJobCompletedSuccess,
  isDirectJobCompletedFailure,
  isDirectJobCompletedSuccess,
} from '../types/direct-job-webhook.types';
import {
  isScrapedJobCompletedFailure,
  isScrapedJobCompletedSuccess,
  ScrapedJobCompletedFailure,
  ScrapedJobCompletedSuccess,
} from '../types/scraped-job-webhook.types';
import { ScrapedJobWebhookBodyDto } from '../dto/scraped-job-webhook.dto';
import { JobSeekerWebhookBodyDto } from '../dto/job-seeker-webhook.dto';
import {
  isJobSeekerCompletedFailure,
  isJobSeekerCompletedSuccess,
  JobSeekerCompletedFailure,
  JobSeekerCompletedSuccess,
} from '../types/job-seeker-webhook.types';

@Injectable()
export class MatchingWebhookService {
  private readonly logger = new Logger(MatchingWebhookService.name);

  constructor(
    private readonly matchingRepository: MatchingRepository,
    @InjectQueue(MATCHING_EMAIL_QUEUE) private readonly matchingEmailQueue: Queue,
  ) {}

  async handleDirectJobWebhook(data: DirectJobWebhookBodyDto) {
    if (isDirectJobCompletedSuccess(data)) {
      this.logger.log(`Direct matching completed for job ${data.jobId}`);
      return await this.handleDirectCompleted(data);
    }

    if (isDirectJobCompletedFailure(data)) {
      this.logger.warn(`Direct matching failed for job ${data.jobId}: ${data.error}`);
      return this.handleDirectFailed(data);
    }

    throw new Error('Unhandled direct matching webhook payload');
  }

  async handleScrapedJobWebhook(data: ScrapedJobWebhookBodyDto) {
    if (isScrapedJobCompletedSuccess(data)) {
      this.logger.log(`Scraped matching completed for window ${data.since} -> ${data.until}`);
      return await this.handleScrapedCompleted(data);
    }

    if (isScrapedJobCompletedFailure(data)) {
      this.logger.warn(`Scraped matching failed: ${data.error}`);
      return this.handleScrapedFailed(data);
    }

    throw new Error('Unhandled scraped matching webhook payload');
  }

  handleJobSeekerWebhook(data: JobSeekerWebhookBodyDto) {
    if (isJobSeekerCompletedSuccess(data)) {
      this.logger.log(`Job seeker matching completed for jobSeekerId ${data.jobSeekerId}`);
      return this.handleJobSeekerCompleted(data);
    }

    if (isJobSeekerCompletedFailure(data)) {
      this.logger.warn(
        `Job seeker matching failed for jobSeekerId ${data.jobSeekerId}: ${data.error}`,
      );
      return this.handleJobSeekerFailed(data);
    }

    throw new Error('Unhandled job seeker matching webhook payload');
  }

  private async handleDirectCompleted(data: DirectJobCompletedSuccess) {
    const target = await this.matchingRepository.findDirectJobNotificationTarget(data.jobId);

    if (!target) {
      this.logger.warn(`No company notification target found for direct job ${data.jobId}`);
      return { status: 'received' };
    }

    await this.matchingEmailQueue.add(
      SEND_DIRECT_MATCHING_EMAIL_JOB,
      {
        companyEmail: target.companyEmail,
        companyName: target.companyName,
        jobTitle: target.jobTitle,
        matchedCandidates: data.upsertedMatches ?? 0,
        processedCandidates: data.processedCandidates ?? 0,
        requestId: data.requestId,
        finishedAt: data.finishedAt,
      } satisfies SendDirectMatchingEmailJob,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );

    return { status: 'received' };
  }

  private async handleScrapedCompleted(data: ScrapedJobCompletedSuccess) {
    const since = new Date(data.since);
    const until = new Date(data.until);
    const startedAt = new Date(data.startedAt);
    const finishedAt = new Date(data.finishedAt);

    if (
      Number.isNaN(since.getTime()) ||
      Number.isNaN(until.getTime()) ||
      Number.isNaN(startedAt.getTime()) ||
      Number.isNaN(finishedAt.getTime())
    ) {
      this.logger.warn(
        `Skipping scraped matching notifications because the webhook timestamps are invalid. requestId=${data.requestId}`,
      );
      return { status: 'received' };
    }

    const targets = await this.matchingRepository.findScrapedJobNotificationTargets(
      startedAt,
      finishedAt,
    );

    if (targets.length === 0) {
      this.logger.log(`No job-seeker notifications to queue for requestId=${data.requestId}`);
      return { status: 'received' };
    }

    await Promise.all(
      targets.map((target) =>
        this.matchingEmailQueue.add(
          SEND_SCRAPED_MATCHING_EMAIL_JOB,
          {
            email: target.email,
            firstName: target.firstName,
            totalMatches: target.totalMatches,
            since: data.since,
            until: data.until,
            topMatches: target.topMatches,
          } satisfies SendScrapedMatchingEmailJob,
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
            removeOnComplete: true,
          },
        ),
      ),
    );

    return { status: 'received' };
  }

  private handleDirectFailed(data: DirectJobCompletedFailure) {
    this.logger.warn(`Direct matching failed. requestId=${data.requestId}  error=${data.error}`);
    return { status: 'received' };
  }

  private handleScrapedFailed(data: ScrapedJobCompletedFailure) {
    this.logger.warn(
      `Scraped matching failed. requestId=${data.requestId} since=${data.since} until=${data.until} error=${data.error}`,
    );
    return { status: 'received' };
  }

  private async handleJobSeekerCompleted(data: JobSeekerCompletedSuccess) {
    this.logger.log(
      `Job seeker matching callback received. requestId=${data.requestId} jobSeekerId=${data.jobSeekerId}`,
    );

    const startedAt = new Date(data.startedAt);
    const finishedAt = new Date(data.finishedAt);

    if (Number.isNaN(startedAt.getTime()) || Number.isNaN(finishedAt.getTime())) {
      this.logger.warn(
        `Skipping job seeker matching notification because timestamps are invalid. requestId=${data.requestId}`,
      );
      return { status: 'received' };
    }

    const targets = await this.matchingRepository.findScrapedJobNotificationTargets(
      startedAt,
      finishedAt,
    );

    const target = targets.find((item) => item.jobSeekerId === data.jobSeekerId);

    if (!target) {
      this.logger.log(`No job-seeker notification target found for requestId=${data.requestId}`);
      return { status: 'received' };
    }

    await this.matchingEmailQueue.add(
      SEND_SCRAPED_MATCHING_EMAIL_JOB,
      {
        email: target.email,
        firstName: target.firstName,
        totalMatches: target.totalMatches,
        since: data.startedAt,
        until: data.finishedAt,
        topMatches: target.topMatches,
      } satisfies SendScrapedMatchingEmailJob,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );

    return { status: 'received' };
  }

  private handleJobSeekerFailed(data: JobSeekerCompletedFailure) {
    this.logger.warn(
      `Job seeker matching failed. requestId=${data.requestId} jobSeekerId=${data.jobSeekerId} error=${data.error}`,
    );
    return { status: 'received' };
  }
}
