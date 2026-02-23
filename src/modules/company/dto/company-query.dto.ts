import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CompanySize, CompanyType } from 'generated/prisma/enums';

export class CompanyQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsEnum(CompanySize)
  @IsString()
  size?: CompanySize;

  @IsOptional()
  @IsEnum(CompanyType)
  @IsString()
  type?: CompanyType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVerified?: boolean;
}
