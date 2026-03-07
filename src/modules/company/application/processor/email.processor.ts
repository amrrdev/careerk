import { Processor, WorkerHost } from '@nestjs/bullmq';
import { APPLICATION_STATUS_EMAIL_QUEUE } from '../jobs/queue.contants';
import { Job } from 'bullmq';
import { UpdateApplicationStatus } from '../jobs/send-update-application-status-email.job';
import { EmailService } from 'src/infrastructure/email/email.service';
import { Logger } from '@nestjs/common';

@Processor(APPLICATION_STATUS_EMAIL_QUEUE)
export class ApplicationStatusEmailProcessor extends WorkerHost {
  private readonly logger = new Logger(ApplicationStatusEmailProcessor.name);
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<UpdateApplicationStatus>): Promise<any> {
    try {
      await this.emailService.sendApplicationStatusUpdateEmail(
        job.data.jobSeekerEmail,
        job.data.firstName,
        job.data.status,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${job.data.jobSeekerEmail}:`, error);
      throw error;
    }
  }
}
