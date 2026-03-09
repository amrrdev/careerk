import { Injectable, Logger } from '@nestjs/common';
import { DirectJobWebhookBodyDto } from '../dto/direct-job.dto';
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

@Injectable()
export class MatchingWebhookService {
  private readonly logger = new Logger(MatchingWebhookService.name);

  handleDirectJobWebhook(data: DirectJobWebhookBodyDto) {
    if (isDirectJobCompletedSuccess(data)) {
      this.logger.log(`Direct matching completed for job ${data.jobId}`);
      return this.handleDirectCompleted(data);
    }

    if (isDirectJobCompletedFailure(data)) {
      this.logger.warn(`Direct matching failed for job ${data.jobId}: ${data.error}`);
      return this.handleDirectFailed(data);
    }

    throw new Error('Unhandled direct matching webhook payload');
  }

  handleScrapedJobWebhook(data: ScrapedJobWebhookBodyDto) {
    if (isScrapedJobCompletedSuccess(data)) {
      this.logger.log(`Scraped matching completed for window ${data.since} -> ${data.until}`);
      return this.handleScrapedCompleted(data);
    }

    if (isScrapedJobCompletedFailure(data)) {
      this.logger.warn(`Scraped matching failed: ${data.error}`);
      return this.handleScrapedFailed(data);
    }

    throw new Error('Unhandled scraped matching webhook payload');
  }

  private handleDirectCompleted(data: DirectJobCompletedSuccess) {
    // send company notifications
    return { status: 'received' };
  }

  private handleScrapedCompleted(data: ScrapedJobCompletedSuccess) {
    // send job seeker notifications
    return { status: 'received' };
  }

  private handleDirectFailed(data: DirectJobCompletedFailure) {
    this.logger.warn(`Direct matching failed. requestId=${data.requestId}  error=${data.error}`);
  }

  private handleScrapedFailed(data: ScrapedJobCompletedFailure) {
    this.logger.warn(
      `Scraped matching failed. requestId=${data.requestId} since=${data.since} until=${data.until} error=${data.error}`,
    );
  }
}
