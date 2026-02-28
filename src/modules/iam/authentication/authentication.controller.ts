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
import { RegisterCompanyDto } from './dto/register-company.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';
import type { Request, Response } from 'express';
import { REFRESH_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_OPTIONS } from '../iam.constants';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordResetService } from './password-reset.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Controller('auth')
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }

  @Post('register/job-seeker')
  @ResponseMessage('Registration successful. Please check your email to verify your account.')
  async registerJobSeeker(@Body() registerJobSeekerDto: RegisterJobSeekerDto) {
    return await this.authenticationService.registerJobSeeker(registerJobSeekerDto);
  }

  @Post('register/company')
  @ResponseMessage(
    'Company registration successful. Please check your email to verify your account.',
  )
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return await this.authenticationService.registerCompany(registerCompanyDto);
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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    "If an account exists with that email, you'll receive a password reset link shortly.",
  )
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordResetService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.passwordResetService.resetPassword(resetPasswordDto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Verification email sent successfully')
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authenticationService.resendVerification(resendVerificationDto.email);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Logged out successfully')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const refreshToken = cookies?.[REFRESH_TOKEN_COOKIE_KEY];

    if (refreshToken && typeof refreshToken === 'string') {
      try {
        const payload = await this.authenticationService['jwtService'].verifyAsync<{
          sub: string;
          type: string;
          tokenType: string;
          refreshTokenId: string;
        }>(refreshToken);

        await this.authenticationService.logout(payload.sub);
      } catch {
        // intentionally empty: ignore invalid refresh token
      }
    }

    response.clearCookie(REFRESH_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_OPTIONS);

    return {};
  }
}
