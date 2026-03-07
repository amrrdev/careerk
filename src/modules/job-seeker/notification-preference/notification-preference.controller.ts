import { Body, Controller, Get, Patch } from '@nestjs/common';
import { NotificationPreferenceService } from './notification-preference.service';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@Controller('job-seekers/me/notification-preference')
export class NotificationPreferenceController {
  constructor(private readonly notificationPreferenceService: NotificationPreferenceService) {}

  @Get()
  async getMyNotificationPreference(@ActiveUser('sub') jobSeekerId: string) {
    return this.notificationPreferenceService.getMyNotificationPreference(jobSeekerId);
  }

  @Patch()
  async updateNotificationPreference(
    @ActiveUser('sub') jobSeekerId: string,
    @Body() updateNotificationPreferenceDto: UpdateNotificationPreferenceDto,
  ) {
    return this.notificationPreferenceService.updateMyNotificationPreference(
      jobSeekerId,
      updateNotificationPreferenceDto,
    );
  }
}
