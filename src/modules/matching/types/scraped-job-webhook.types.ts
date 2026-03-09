import { ScrapedJobWebhookBodyDto } from '../dto/scraped-job-webhook.dto';

export type ScrapedJobCompletedSuccess = {
  type: 'scraped';
  status: 'completed';
  since: string;
  until: string;
  requestId: string;
  processedJobs: number;
  processedCandidates: number;
  upsertedMatches: number;
  startedAt: string;
  finishedAt: string;
};

export type ScrapedJobCompletedFailure = {
  type: 'scraped';
  status: 'failed';
  since: string;
  until: string;
  requestId: string;
  error: string;
  startedAt: string;
  finishedAt: string;
};

export function isScrapedJobCompletedSuccess(
  data: ScrapedJobWebhookBodyDto,
): data is ScrapedJobCompletedSuccess {
  return data.status === 'completed';
}

export function isScrapedJobCompletedFailure(
  data: ScrapedJobWebhookBodyDto,
): data is ScrapedJobCompletedFailure {
  return data.status === 'failed';
}
