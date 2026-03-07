import { Module } from '@nestjs/common';
import { NotificationPreferenceService } from './notification-preference.service';
import { NotificationPreferenceRepository } from './repository/notification-preference.respository';
import { NotificationPreferenceRepositoryImpl } from './repository/notification-preference.respository.impl';
import { NotificationPreferenceController } from './notification-preference.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationPreferenceController],
  providers: [
    NotificationPreferenceService,
    {
      provide: NotificationPreferenceRepository,
      useClass: NotificationPreferenceRepositoryImpl,
    },
  ],
  exports: [NotificationPreferenceService],
})
export class NotificationPreferenceModule {}
