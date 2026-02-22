import { IsEnum, IsString, IsUUID } from 'class-validator';
import { JobSourceEnum } from 'generated/prisma/enums';

export class BookmarkJobDto {
  @IsUUID()
  jobId: string;

  @IsEnum(JobSourceEnum)
  @IsString()
  jobSource: JobSourceEnum;
}
