import { Injectable, Logger } from '@nestjs/common';
import { NlpParseCvRequest, NlpParseCvResponse } from './interfaces/nlp.interface';
import {
  DirectJobMacthingRequest,
  DirectJobMatchingAcceptedResponse,
} from './interfaces/matching.interface';

@Injectable()
export class NlpService {
  private readonly logger = new Logger(NlpService.name);
  private readonly nlpApiUrl = 'http://localhost:8000';

  async directJobMatch(
    request: DirectJobMacthingRequest,
  ): Promise<DirectJobMatchingAcceptedResponse> {
    try {
      this.logger.log(`Calling Matching api for direct job: ${request.jobId}`);

      const response = await fetch(`${this.nlpApiUrl}/match/direct-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: request.jobId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Matching Service returned ${response.status}: ${errorText}`);
      }
      const data: unknown = await response.json();

      return data as DirectJobMatchingAcceptedResponse;
    } catch (error) {
      this.logger.error(`Matching API error for jobId: ${request.jobId}`, error);
      throw error;
    }
  }

  async parseCv(request: NlpParseCvRequest): Promise<NlpParseCvResponse> {
    const startTime = Date.now();
    try {
      this.logger.log(`Calling NLP API for jobSeekerId: ${request.jobSeekerId}`);

      const response = await fetch(`${this.nlpApiUrl}/parse-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: request.cvUrl,
          jobSeekerId: request.jobSeekerId,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`NLP API returned ${response.status}: ${errorText}`);
      }

      const data: unknown = await response.json();
      const processingTime = Date.now() - startTime;
      this.logger.log(
        `NLP parsing completed in ${processingTime}ms for jobSeekerId: ${request.jobSeekerId}`,
      );

      return data as NlpParseCvResponse;
    } catch (error) {
      this.logger.error(`NLP API error for jobSeekerId: ${request.jobSeekerId}`, error);
      throw error;
    }
  }
}
