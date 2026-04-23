import { JobSeekerWebhookBodyDto } from '../dto/job-seeker-webhook.dto';

export type JobSeekerCompletedSuccess = {
  type: 'job-seeker';
  status: 'completed';
  requestId: string;
  jobSeekerId: string;
  startedAt: string;
  finishedAt: string;
  error?: string;
};

export type JobSeekerCompletedFailure = {
  type: 'job-seeker';
  status: 'failed';
  requestId: string;
  jobSeekerId: string;
  error: string;
  startedAt: string;
  finishedAt: string;
};

export function isJobSeekerCompletedSuccess(
  data: JobSeekerWebhookBodyDto,
): data is JobSeekerCompletedSuccess {
  return data.status === 'completed';
}

export function isJobSeekerCompletedFailure(
  data: JobSeekerWebhookBodyDto,
): data is JobSeekerCompletedFailure {
  return data.status === 'failed';
}
