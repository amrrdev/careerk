import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { DegreeTypeEnum } from 'generated/prisma/enums';

export class CreateEducationDto {
  @IsString()
  institutionName: string;

  @IsEnum(DegreeTypeEnum)
  degreeType: DegreeTypeEnum;

  @IsString()
  fieldOfStudy: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  gpa?: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  isCurrent: boolean;
}
