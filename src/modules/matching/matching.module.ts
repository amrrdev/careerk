import { Module } from '@nestjs/common';
import { MatchingWebhookController } from './webhook/webhook.controller';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingWebhookService } from './webhook/webhook.service';

@Module({
  controllers: [MatchingWebhookController, MatchingController],
  providers: [MatchingService, MatchingWebhookService],
})
export class MatchingModule {}
