import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ExperienceLevelEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export class JobQueryDto {
  @IsString()
  @IsOptional()
  source?: 'direct' | 'scraped' | 'all' = 'all';

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(JobTypeEnum)
  @IsString()
  jobType?: JobTypeEnum;

  @IsOptional()
  @IsEnum(WorkPreferenceEnum)
  @IsString()
  workPreference?: WorkPreferenceEnum;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  search?: string;

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
  salaryMax?: number;
}
