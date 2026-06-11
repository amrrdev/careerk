import { Controller, Get, Query } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewQueryDto } from './dto/interview-query.dto';
import { Auth } from 'src/modules/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/modules/iam/enums/auth-type.enum';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';

@Auth(AuthType.Bearer)
@Controller('interview-questions')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  @ResponseMessage('Interview questions retrieved successfully')
  getQuestions(@Query() query: InterviewQueryDto) {
    return this.interviewService.getQuestions(query);
  }
}
