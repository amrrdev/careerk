import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../../iam/enums/auth-type.enum';
import { MatchingWebhookService } from './webhook.service';
import { DirectJobWebhookBodyDto } from '../dto/direct-job.dto';
import { ScrapedJobWebhookBodyDto } from '../dto/scraped-job-webhook.dto';
import { JobSeekerWebhookBodyDto } from '../dto/job-seeker-webhook.dto';

@Controller('internal/matching')
@Auth(AuthType.None)
export class MatchingWebhookController {
  constructor(private readonly matchingWebhookService: MatchingWebhookService) {}

  @Post('direct/completed')
  async directJobCompleted(@Body() data: DirectJobWebhookBodyDto) {
    return await this.matchingWebhookService.handleDirectJobWebhook(data);
  }

  @Post('scraped/completed')
  async scrapedJobCompleted(@Body() data: ScrapedJobWebhookBodyDto) {
    return await this.matchingWebhookService.handleScrapedJobWebhook(data);
  }

  @Post('job-seeker/completed')
  jobSeekerCompleted(@Body() data: JobSeekerWebhookBodyDto) {
    return this.matchingWebhookService.handleJobSeekerWebhook(data);
  }
}
