import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register/job-seeker')
  async registerJobSeeker(@Body() registerJobSeekerDto: RegisterJobSeekerDto) {
    return this.authenticationService.registerJobSeeker(registerJobSeekerDto);
  }
}
