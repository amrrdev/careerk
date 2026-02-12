import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AvailabilityStatusEnum, JobTypeEnum, WorkPreferenceEnum } from 'generated/prisma/enums';

export class JobSeekerQueryDto {
  @IsOptional()
  @IsEnum(AvailabilityStatusEnum)
  availabilityStatus?: AvailabilityStatusEnum;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(WorkPreferenceEnum)
  workPreference?: WorkPreferenceEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minYearsOfExperience?: number;

  @IsOptional()
  @IsEnum(JobTypeEnum, { each: true })
  @Transform(({ value }: { value: string | string[] }) => {
    const arr = Array.isArray(value) ? value : [value];
    return arr.map((v) => v as JobTypeEnum);
  })
  preferredJobTypes?: JobTypeEnum[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxNoticePeriod?: number;

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
}
