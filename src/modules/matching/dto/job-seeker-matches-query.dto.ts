import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class JobSeekerMatchesQueryDto {
  @IsOptional()
  @IsIn(['all', 'direct', 'scraped'])
  type?: 'all' | 'direct' | 'scraped' = 'all';

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
}
