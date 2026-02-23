import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicationStatusEnum } from 'generated/prisma/enums';

export class ApplicationQueryDto {
  @IsOptional()
  @IsEnum(ApplicationStatusEnum)
  @IsString()
  status?: ApplicationStatusEnum;

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
