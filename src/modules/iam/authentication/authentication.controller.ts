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
  @ResponseMessage('Job Seeker created successfully')
  async registerJobSeeker(
    @Body() registerJobSeekerDto: RegisterJobSeekerDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, ...result } =
      await this.authenticationService.registerJobSeeker(registerJobSeekerDto);
    this.setRefreshTokenCookie(response, refreshToken);
    return result;
  }

  // @Post('register/company')
  // async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
  //   return this.authenticationService.registerCompany(registerCompanyDto);
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login Successfully')
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
