import { Injectable } from '@nestjs/common';
import { NotificationPreferenceRepository } from './notification-preference.respository';
import {
  NotificationPreference,
  notificationPreferenceSelect,
  UpdateNotificationPreference,
} from '../types/notification.preference.types';
import { DatabaseService } from 'src/infrastructure/database/database.service';

@Injectable()
export class NotificationPreferenceRepositoryImpl implements NotificationPreferenceRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findMyNotificationPreference(jobSeekerId: string): Promise<NotificationPreference> {
    return this.databaseService.jobSeekerNotificationPreference.upsert({
      where: { jobSeekerId },
      create: {
        jobSeekerId,
      },
      update: {},
      ...notificationPreferenceSelect,
    });
  }

  async updateNotificationPreference(
    jobSeekerId: string,
    updateNotificationPreference: UpdateNotificationPreference,
  ): Promise<void> {
    await this.databaseService.jobSeekerNotificationPreference.upsert({
      where: { jobSeekerId },
      create: {
        jobSeekerId,
        ...updateNotificationPreference,
      },
      update: {
        ...updateNotificationPreference,
      },
    });
  }
}
