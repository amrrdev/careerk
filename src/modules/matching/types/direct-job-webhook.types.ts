import { DirectJobWebhookBodyDto } from '../dto/direct-job.dto';

export type DirectJobCompletedSuccess = {
  type: 'direct';
  status: 'completed';
  jobId: string;
  requestId: string;
  processedJobs: number;
  processedCandidates: number;
  upsertedMatches: number;
  startedAt: string;
  finishedAt: string;
};

export type DirectJobCompletedFailure = {
  type: 'direct';
  status: 'failed';
  jobId: string;
  requestId: string;
  error: string;
  startedAt: string;
  finishedAt: string;
};

export function isDirectJobCompletedSuccess(
  data: DirectJobWebhookBodyDto,
): data is DirectJobCompletedSuccess {
  return data.status === 'completed';
}

export function isDirectJobCompletedFailure(
  data: DirectJobWebhookBodyDto,
): data is DirectJobCompletedFailure {
  return data.status === 'failed';
}
