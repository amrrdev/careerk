import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NlpService } from 'src/infrastructure/nlp/nlp.service';
import { JobSeekerMatchingRequest } from 'src/infrastructure/nlp/interfaces/matching.interface';
import { CV_MATCHING_QUEUE } from './cv-matching.jobs';

@Processor(CV_MATCHING_QUEUE)
export class CvMatchingProcessor extends WorkerHost {
  private readonly logger = new Logger(CvMatchingProcessor.name);

  constructor(private readonly nlpService: NlpService) {
    super();
  }

  async process(job: Job<JobSeekerMatchingRequest>) {
    try {
      return await this.nlpService.jobSeekerMatch(job.data);
    } catch (error) {
      this.logger.error(
        `Error while sending job seeker matching request for ${job.data.jobSeekerId}`,
        error,
      );
      throw error;
    }
  }
}
