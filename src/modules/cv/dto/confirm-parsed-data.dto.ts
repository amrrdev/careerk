import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AvailabilityStatusEnum, DegreeTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

class PersonalInfoDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  portfolioUrl?: string;
}

class EducationDto {
  @IsString()
  institutionName: string;

  @IsString()
  @IsEnum(DegreeTypeEnum)
  degreeType: DegreeTypeEnum;

  @IsString()
  fieldOfStudy: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  isCurrent: boolean;

  @IsOptional()
  @IsNumber()
  gpa?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

class WorkExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  isCurrent: boolean;

  @IsString()
  description: string;
}

class SkillDto {
  @IsString()
  name: string;

  @IsBoolean()
  verified: boolean;
}

class ProfileDto {
  @IsOptional()
  @IsNumber()
  expectedSalary?: number;

  @IsString()
  @IsEnum(WorkPreferenceEnum)
  workPreference: WorkPreferenceEnum;

  @IsNumber()
  yearsOfExperience: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value !== undefined && value !== null ? Number(value) : undefined))
  noticePeriod?: number;

  @IsString()
  @IsEnum(AvailabilityStatusEnum)
  availabilityStatus: AvailabilityStatusEnum;
}

export class ConfirmParsedDataDto {
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education: EducationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience: WorkExperienceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills: SkillDto[];

  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;
}
