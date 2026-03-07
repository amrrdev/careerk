import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferenceDto {
  @IsBoolean()
  @IsOptional()
  applicationStatusNotificationsEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  jobMatchNotificationsEnabled?: boolean;
}
