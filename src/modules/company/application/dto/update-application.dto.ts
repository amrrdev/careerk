import { IsEnum, IsString } from 'class-validator';
import { ApplicationStatusEnum } from 'generated/prisma/enums';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatusEnum)
  @IsString()
  status: ApplicationStatusEnum;
}
