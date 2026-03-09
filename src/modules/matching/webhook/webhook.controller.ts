import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../../iam/enums/auth-type.enum';
import { MatchingWebhookService } from './webhook.service';
import { DirectJobWebhookBodyDto } from '../dto/direct-job.dto';
import { ScrapedJobWebhookBodyDto } from '../dto/scraped-job-webhook.dto';

@Controller('internal/matching')
@Auth(AuthType.None)
export class MatchingWebhookController {
  constructor(private readonly matchingWebhookService: MatchingWebhookService) {}

  @Post('direct/completed')
  directJobCompleted(@Body() data: DirectJobWebhookBodyDto) {
    return this.matchingWebhookService.handleDirectJobWebhook(data);
  }

  @Post('scraped/completed')
  scrapedJobCompleted(@Body() data: ScrapedJobWebhookBodyDto) {
    // TODO: send email for job seekers
    return { status: 'received' };
  }
}
