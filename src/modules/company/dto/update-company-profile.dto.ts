import { IsOptional, IsString, IsUrl, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompanyProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  headquartersLocation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  foundedYear?: number;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsUrl()
  linkedIn?: string;

  @IsOptional()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;
}
