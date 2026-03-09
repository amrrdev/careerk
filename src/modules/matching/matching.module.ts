import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { EmailModule } from 'src/infrastructure/email/email.module';
import { MATCHING_EMAIL_QUEUE } from './jobs/queue.constants';
import { MatchingWebhookController } from './webhook/webhook.controller';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingWebhookService } from './webhook/webhook.service';
import { MatchingEmailProcessor } from './processors/email.processor';
import { MatchingRepository } from './repository/matching.repository';
import { MatchingRepositoryImpl } from './repository/matching.repository.impl';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    BullModule.registerQueue({
      name: MATCHING_EMAIL_QUEUE,
    }),
  ],
  controllers: [MatchingWebhookController, MatchingController],
  providers: [
    MatchingService,
    MatchingEmailProcessor,
    MatchingWebhookService,
    {
      provide: MatchingRepository,
      useClass: MatchingRepositoryImpl,
    },
  ],
})
export class MatchingModule {}
