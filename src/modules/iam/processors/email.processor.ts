import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  EMAIL_QUEUE,
  SEND_PASSWORD_RESET_EMAIL_JOB,
  SEND_VERIFICATION_EMAIL_JOB,
} from '../jobs/queue.constants';
import { Job } from 'bullmq';
import { EmailService } from 'src/infrastructure/email/email.service';
import { SendVerificationEmailJob } from '../jobs/send-verification-email.job';
import { Logger } from '@nestjs/common';
import { SendPasswordResetEmailJob } from '../jobs/send-password-reset-email.job';

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<SendVerificationEmailJob | SendPasswordResetEmailJob>): Promise<any> {
    try {
      switch (job.name) {
        case SEND_VERIFICATION_EMAIL_JOB:
          return await this.handleVerificationEmail(job as Job<SendVerificationEmailJob>);
        case SEND_PASSWORD_RESET_EMAIL_JOB:
          return await this.handlePasswordResetEmail(job as Job<SendPasswordResetEmailJob>);
      }
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${job.data.email}:`, error);
      throw error;
    }
  }

  private async handleVerificationEmail(job: Job<SendVerificationEmailJob>) {
    this.logger.log(`Processing verification email for ${job.data.email}`);
    await this.emailService.sendVerificationEmail(job.data.email, job.data.code, job.data.userName);
    return { success: true };
  }

  private async handlePasswordResetEmail(job: Job<SendPasswordResetEmailJob>) {
    await this.emailService.sendPasswordResetEmail(
      job.data.email,
      job.data.code,
      job.data.userName,
    );
    return { success: true };
  }
}
