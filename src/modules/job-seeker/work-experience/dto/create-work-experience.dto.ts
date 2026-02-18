import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  description?: string;

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
}
