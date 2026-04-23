import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class JobSeekerWebhookBodyDto {
  @IsIn(['job-seeker'])
  type: 'job-seeker';

  @IsIn(['completed', 'failed'])
  status: 'completed' | 'failed';

  @IsUUID()
  jobSeekerId: string;

  @IsString()
  requestId: string;

  @IsOptional()
  @IsString()
  since?: string;

  @IsOptional()
  @IsString()
  until?: string;

  @IsOptional()
  @IsNumber()
  processedJobs?: number;

  @IsOptional()
  @IsNumber()
  processedDirectJobs?: number;

  @IsOptional()
  @IsNumber()
  processedScrapedJobs?: number;

  @IsOptional()
  @IsNumber()
  processedCandidates?: number;

  @IsOptional()
  @IsNumber()
  upsertedMatches?: number;

  @IsOptional()
  @IsNumber()
  upsertedDirectMatches?: number;

  @IsOptional()
  @IsNumber()
  upsertedScrapedMatches?: number;

  @IsOptional()
  @IsNumber()
  scrapedLookbackDays?: number;

  @IsString()
  startedAt: string;

  @IsString()
  finishedAt: string;

  @IsOptional()
  @IsString()
  error?: string;
}
