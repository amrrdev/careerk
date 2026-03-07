import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CompanyApplicationService } from './application.service';
import { CompanyApplicationRepository } from './repository/application.repository';
import { CompanyApplicationRepositoryImpl } from './repository/application.repository.impl';
import { CompanyApplicationController } from './application.controller';
import { CvModule } from 'src/modules/cv/cv.module';
import { NotificationPreferenceModule } from 'src/modules/job-seeker/notification-preference/notification-preference.module';
import { EmailModule } from 'src/infrastructure/email/email.module';
import { BullModule } from '@nestjs/bullmq';
import { APPLICATION_STATUS_EMAIL_QUEUE } from './jobs/queue.contants';
import { ApplicationStatusEmailProcessor } from './processor/email.processor';

@Module({
  imports: [
    DatabaseModule,
    CvModule,
    NotificationPreferenceModule,
    EmailModule,
    BullModule.registerQueue({
      name: APPLICATION_STATUS_EMAIL_QUEUE,
    }),
  ],
  controllers: [CompanyApplicationController],
  providers: [
    ApplicationStatusEmailProcessor,
    CompanyApplicationService,
    {
      provide: CompanyApplicationRepository,
      useClass: CompanyApplicationRepositoryImpl,
    },
  ],
})
export class CompanyApplicationModule {}
