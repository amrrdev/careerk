import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingRepository } from './repository/matching.repository';
import { MatchingRepositoryImpl } from './repository/matching.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module'; // use the same DatabaseModule as JobSeekerModule
import { MatchingWebhookController } from './webhook/webhook.controller';
import { MatchingWebhookService } from './webhook/webhook.service';
import { MATCHING_EMAIL_QUEUE } from './jobs/queue.constants';
import { MatchingEmailProcessor } from './processors/email.processor';
import { EmailModule } from 'src/infrastructure/email/email.module';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: MATCHING_EMAIL_QUEUE,
    }),
    EmailModule,
  ],
  controllers: [MatchingController, MatchingWebhookController],
  providers: [
    MatchingService,
    MatchingWebhookService,
    MatchingEmailProcessor,
    {
      provide: MatchingRepository,
      useClass: MatchingRepositoryImpl,
    },
  ],
  exports: [MatchingRepository],
})
export class MatchingModule {}
