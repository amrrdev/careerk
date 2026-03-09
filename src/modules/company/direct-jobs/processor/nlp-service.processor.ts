import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NlpService } from 'src/infrastructure/nlp/nlp.service';
import { NLP_QUEUE } from './nlp-service.jobs';
import { Logger } from '@nestjs/common';

@Processor(NLP_QUEUE)
export class NlpProcessor extends WorkerHost {
  private readonly logger = new Logger(NlpProcessor.name);
  constructor(private readonly nlpService: NlpService) {
    super();
  }

  async process(job: Job<{ jobId: string }>): Promise<any> {
    try {
      console.log('bullqme will send to nlp');
      return await this.nlpService.directJobMatch(job.data);
    } catch (error) {
      this.logger.error(`Error while sending maytching request to nlp service: ${error}`);
      throw error;
    }
  }
}
