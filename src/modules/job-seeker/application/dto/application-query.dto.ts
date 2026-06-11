import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApplicationStatusEnum } from 'generated/prisma/enums';

export class ApplicationQueryDto {
  @IsOptional()
  @IsEnum(ApplicationStatusEnum, { each: true })
  @Transform(({ value }: { value: string | string[] }) => {
    const arr = Array.isArray(value) ? value : [value];
    return arr.map((v) => v as ApplicationStatusEnum);
  })
  status?: ApplicationStatusEnum[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['Last 24 hours', 'Last 7 days', 'Last 30 days', 'All time'])
  dateApplied?: 'Last 24 hours' | 'Last 7 days' | 'Last 30 days' | 'All time';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
