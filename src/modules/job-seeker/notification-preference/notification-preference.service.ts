import { Injectable } from '@nestjs/common';
import { NotificationPreferenceRepository } from './repository/notification-preference.respository';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@Injectable()
export class NotificationPreferenceService {
  constructor(
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
  ) {}

  async getMyNotificationPreference(jobSeekerId: string) {
    return await this.notificationPreferenceRepository.findMyNotificationPreference(jobSeekerId);
  }

  async updateMyNotificationPreference(
    jobSeekerId: string,
    updateNotificationPreferenceDto: UpdateNotificationPreferenceDto,
  ) {
    await this.notificationPreferenceRepository.updateNotificationPreference(
      jobSeekerId,
      updateNotificationPreferenceDto,
    );
    return {};
  }
}
