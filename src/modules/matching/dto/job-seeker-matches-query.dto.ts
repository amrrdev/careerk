import { IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceLevelEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export class JobSeekerMatchesQueryDto {
  @IsOptional()
  @IsIn(['all', 'direct', 'scraped'])
  type?: 'all' | 'direct' | 'scraped' = 'all';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minScore?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(JobTypeEnum)
  @IsString()
  jobType?: JobTypeEnum;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(WorkPreferenceEnum)
  @IsString()
  workPreference?: WorkPreferenceEnum;

  @IsOptional()
  @IsString()
  @IsEnum(ExperienceLevelEnum)
  experienceLevel?: ExperienceLevelEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMax?: number;
}
