import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import type { Request, Response } from 'express';
import { REFRESH_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_OPTIONS } from '../iam.constants';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';

@Controller('auth')
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }

  @Post('register/job-seeker')
  @ResponseMessage('Registration successful. Please check your email to verify your account.')
  async registerJobSeeker(@Body() registerJobSeekerDto: RegisterJobSeekerDto) {
    return await this.authenticationService.registerJobSeeker(registerJobSeekerDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email verified successfully. You are now logged in.')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, ...result } = await this.authenticationService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );
    this.setRefreshTokenCookie(response, refreshToken);
    return result;
  }

  // @Post('register/company')
  // async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
  //   return this.authenticationService.registerCompany(registerCompanyDto);
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successfully')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...result } = await this.authenticationService.login(loginDto);
    this.setRefreshTokenCookie(response, refreshToken);
    return result;
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const refreshToken = cookies?.[REFRESH_TOKEN_COOKIE_KEY];

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authenticationService.refreshToken({ refreshToken });
    this.setRefreshTokenCookie(response, result.refreshToken);

    return { accessToken: result.accessToken };
  }
}
