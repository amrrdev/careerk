import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class ScrapedJobWebhookBodyDto {
  @IsIn(['scraped'])
  type: 'scraped';

  @IsIn(['completed', 'failed'])
  status: 'completed' | 'failed';

  @IsString()
  since: string;

  @IsString()
  until: string;

  @IsString()
  requestId: string;

  @IsString()
  startedAt: string;

  @IsString()
  finishedAt: string;

  @IsOptional()
  @IsNumber()
  processedJobs?: number;

  @IsOptional()
  @IsNumber()
  processedCandidates?: number;

  @IsOptional()
  @IsNumber()
  upsertedMatches?: number;

  @IsOptional()
  @IsString()
  error?: string;
}
