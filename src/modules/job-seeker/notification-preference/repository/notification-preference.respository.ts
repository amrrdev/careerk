import { Injectable } from '@nestjs/common';
import {
  NotificationPreference,
  UpdateNotificationPreference,
} from '../types/notification.preference.types';

@Injectable()
export abstract class NotificationPreferenceRepository {
  abstract findMyNotificationPreference(jobSeekerId: string): Promise<NotificationPreference>;
  abstract updateNotificationPreference(
    jobSeekerId: string,
    updateNotificationPreference: UpdateNotificationPreference,
  ): Promise<void>;
}
