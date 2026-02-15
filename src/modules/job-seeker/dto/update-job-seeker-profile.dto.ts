import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AvailabilityStatusEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export class UpdateJobSeekerProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(AvailabilityStatusEnum)
  availabilityStatus?: AvailabilityStatusEnum;

  @IsOptional()
  @IsEnum(WorkPreferenceEnum)
  workPreference?: WorkPreferenceEnum;

  @IsOptional()
  @IsArray()
  @IsEnum(JobTypeEnum, { each: true })
  preferredJobTypes?: JobTypeEnum[];

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsNumber()
  expectedSalary?: number;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;
}
