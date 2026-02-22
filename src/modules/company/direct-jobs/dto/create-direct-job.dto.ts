import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ExperienceLevelEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export class CreateDirectJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @IsEnum(JobTypeEnum)
  jobType: JobTypeEnum;

  @IsEnum(WorkPreferenceEnum)
  workPreference: WorkPreferenceEnum;

  @IsEnum(ExperienceLevelEnum)
  experienceLevel: ExperienceLevelEnum;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillNames?: string[];
}
