import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class DirectJobWebhookBodyDto {
  @IsIn(['direct'])
  type: 'direct';

  @IsIn(['completed', 'failed'])
  status: 'completed' | 'failed';

  @IsUUID()
  jobId: string;

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
