import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { InterviewRole, InterviewLevel, QuestionCategory } from 'generated/prisma/enums';

export class InterviewQueryDto {
  @IsOptional()
  @IsEnum(InterviewRole)
  role?: InterviewRole;

  @IsOptional()
  @IsEnum(InterviewLevel)
  level?: InterviewLevel;

  @IsOptional()
  @IsEnum(QuestionCategory)
  category?: QuestionCategory;

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
