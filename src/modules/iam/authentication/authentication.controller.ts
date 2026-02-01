import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Controller('auth')
@Auth(AuthType.None)
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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authenticationService.login(loginDto);
  }
}
