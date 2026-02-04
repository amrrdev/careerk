import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EMAIL_QUEUE } from '../jobs/queue.constants';
import { Job } from 'bullmq';
import { EmailService } from 'src/infrastructure/email/email.service';
import { SendVerificationEmailJob } from '../jobs/send-verification-email.job';
import { Logger } from '@nestjs/common';

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<SendVerificationEmailJob>): Promise<void> {
    try {
      this.logger.log(`Processing verification email for ${job.data.email}`);
      await this.emailService.sendVerificationEmail(
        job.data.email,
        job.data.code,
        job.data.userName,
      );
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${job.data.email}:`, error);
      throw error;
    }
  }
}
