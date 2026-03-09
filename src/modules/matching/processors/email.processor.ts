import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from 'src/infrastructure/email/email.service';
import {
  MATCHING_EMAIL_QUEUE,
  SEND_DIRECT_MATCHING_EMAIL_JOB,
  SEND_SCRAPED_MATCHING_EMAIL_JOB,
} from '../jobs/queue.constants';
import { SendDirectMatchingEmailJob } from '../jobs/send-direct-matching-email.job';
import { SendScrapedMatchingEmailJob } from '../jobs/send-scraped-matching-email.job';

@Processor(MATCHING_EMAIL_QUEUE)
export class MatchingEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(MatchingEmailProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<SendDirectMatchingEmailJob | SendScrapedMatchingEmailJob>): Promise<any> {
    try {
      switch (job.name) {
        case SEND_DIRECT_MATCHING_EMAIL_JOB:
          return await this.handleDirectMatchingEmail(job as Job<SendDirectMatchingEmailJob>);
        case SEND_SCRAPED_MATCHING_EMAIL_JOB:
          return await this.handleScrapedMatchingEmail(job as Job<SendScrapedMatchingEmailJob>);
      }
    } catch (error) {
      this.logger.error(`Failed to process matching email job ${job.name}:`, error);
      throw error;
    }
  }

  private async handleDirectMatchingEmail(job: Job<SendDirectMatchingEmailJob>) {
    await this.emailService.sendDirectMatchingCompletedEmail(job.data);
    return { success: true };
  }

  private async handleScrapedMatchingEmail(job: Job<SendScrapedMatchingEmailJob>) {
    await this.emailService.sendScrapedMatchingCompletedEmail(job.data);
    return { success: true };
  }
}
