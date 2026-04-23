import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AvailabilityStatusEnum, DegreeTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export class PersonalInfoDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  cvEmail: string;

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

export class EducationDto {
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

export class WorkExperienceDto {
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

export class SkillDto {
  @IsString()
  name: string;

  @IsBoolean()
  verified: boolean;
}

export class ProfileDto {
  @IsOptional()
  @IsNumber()
  expectedSalary?: number;

  @IsString()
  @IsEnum(WorkPreferenceEnum)
  workPreference: WorkPreferenceEnum;

  @IsNumber()
  yearsOfExperience: number;

  @IsOptional()
  @IsNumber()
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

export class ConfirmParsedDataPayloadDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  cvEmail?: string;

  @IsOptional()
  @IsString()
  phone?: string;

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

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience?: WorkExperienceDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsEnum(WorkPreferenceEnum)
  workPreference: WorkPreferenceEnum;

  @IsOptional()
  @IsNumber()
  expectedSalary?: number;

  @IsOptional()
  @IsNumber()
  noticePeriod?: number;

  @IsEnum(AvailabilityStatusEnum)
  availabilityStatus: AvailabilityStatusEnum;
}

export class ConfirmParsedDataRequestDto {
  @IsUUID()
  parseResultId: string;

  @IsDefined({
    message:
      'data is required. Required fields: workPreference, availabilityStatus. Optional: any CV field you want to override',
  })
  @ValidateNested()
  @Type(() => ConfirmParsedDataPayloadDto)
  data: ConfirmParsedDataPayloadDto;
}
