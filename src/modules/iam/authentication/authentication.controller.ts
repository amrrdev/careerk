import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register/job-seeker')
  async registerJobSeeker(@Body() registerJobSeekerDto: RegisterJobSeekerDto) {
    return this.authenticationService.registerJobSeeker(registerJobSeekerDto);
  }

  // @Post('register/company')
  // async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
  //   return this.authenticationService.registerCompany(registerCompanyDto);
  // }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }
}
