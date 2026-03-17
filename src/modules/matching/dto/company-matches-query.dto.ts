import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyMatchesQueryDto {
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
  minScore?: number;

  @IsOptional()
  availabilityStatus?: string;
}
