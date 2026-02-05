import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { JobSeekerRepository } from 'src/modules/job-seeker/repositories/job-seeker.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { LoginDto } from './dto/login.dto';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../enums/user-type.enum';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenType } from '../enums/token-type.enum';
import { RefreshTokenStorageService } from './refresh-token-storage.service';
import { randomUUID } from 'node:crypto';
import { OtpService } from '../otp/otp.service';
import { OtpPurpose } from '../enums/otp-purpose.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EMAIL_QUEUE, SEND_VERIFICATION_EMAIL_JOB } from '../jobs/queue.constants';
import { SendVerificationEmailJob } from '../jobs/send-verification-email.job';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly hashingService: HashingService,
    private readonly refreshTokenStroageService: RefreshTokenStorageService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    @Inject(jwtConfig.KEY) private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const [jobSeeker, company] = await Promise.all([
        this.jobSeekerRepository.findByEmail(loginDto.email),
        this.companyRepository.findByEmail(loginDto.email),
      ]);

      const user = jobSeeker || company;
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email before logging in');
      }

      const userType = jobSeeker ? UserType.JOB_SEEKER : UserType.COMPANY;

      const isPasswordValid = await this.hashingService.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { accessToken, refreshToken } = await this.generateTokens({
        email: user.email,
        sub: user.id,
        type: userType,
      });

      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async registerJobSeeker(registerJobSeekerDto: RegisterJobSeekerDto) {
    try {
      await this.checkEmailExists(registerJobSeekerDto.email);

      const hashedPassword = await this.hashingService.hash(registerJobSeekerDto.password);
      const jobSeeker = await this.jobSeekerRepository.create({
        ...registerJobSeekerDto,
        password: hashedPassword,
      });

      const otp = await this.otpService.createOtp(
        jobSeeker.email,
        OtpPurpose.EMAIL_VERIFICATION,
        UserType.JOB_SEEKER,
      );

      await this.emailQueue.add(
        SEND_VERIFICATION_EMAIL_JOB,
        {
          email: jobSeeker.email,
          code: otp,
          userName: jobSeeker.firstName,
        } as SendVerificationEmailJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );

      return {
        email: jobSeeker.email,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create job seeker');
    }
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    try {
      await this.checkEmailExists(registerCompanyDto.email);

      const hashedPassword = await this.hashingService.hash(registerCompanyDto.password);
      const company = await this.companyRepository.create({
        ...registerCompanyDto,
        password: hashedPassword,
      });

      const otp = await this.otpService.createOtp(
        company.email,
        OtpPurpose.EMAIL_VERIFICATION,
        UserType.COMPANY,
      );

      await this.emailQueue.add(
        SEND_VERIFICATION_EMAIL_JOB,
        {
          email: company.email,
          code: otp,
          userName: company.name,
        } as SendVerificationEmailJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );

      return {
        email: company.email,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        type: UserType;
        tokenType: TokenType;
        refreshTokenId: string;
      }>(refreshTokenDto.refreshToken, {
        secret: this.jwtConfigurations.secret,
        issuer: this.jwtConfigurations.issuer,
        audience: this.jwtConfigurations.audience,
      });

      if (payload.tokenType !== TokenType.REFRESH) {
        throw new UnauthorizedException('Invalid token type');
      }

      const user =
        payload.type === UserType.JOB_SEEKER
          ? await this.jobSeekerRepository.findById(payload.sub)
          : await this.companyRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValid = await this.refreshTokenStroageService.validate(
        user.id,
        payload.refreshTokenId,
      );
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.refreshTokenStroageService.invalidate(user.id);
      return await this.generateTokens({ email: user.email, sub: user.id, type: payload.type });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(email: string, code: string) {
    try {
      const otpData = await this.otpService.verifyOtp(email, code, OtpPurpose.EMAIL_VERIFICATION);

      if (!otpData) {
        throw new UnauthorizedException('Invalid or expired OTP code');
      }

      const updatedUser =
        otpData.userType === UserType.JOB_SEEKER
          ? await this.jobSeekerRepository.findByEmailAndUpdate(email, {
              isVerified: true,
              lastLoginAt: new Date(),
            })
          : await this.companyRepository.findByEmailAndUpdate(email, {
              isVerified: true,
            });

      if (!updatedUser) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken } = await this.generateTokens({
        email: updatedUser.email,
        sub: updatedUser.id,
        type: otpData.userType,
      });

      return {
        ...updatedUser,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnauthorizedException('Email verification failed');
    }
  }

  private async checkEmailExists(email: string): Promise<void> {
    const [isJobSeekerExists, isCompanyExists] = await Promise.all([
      this.jobSeekerRepository.existsByEmail(email),
      this.companyRepository.existsByEmail(email),
    ]);

    if (isJobSeekerExists || isCompanyExists) {
      throw new ConflictException('An account with this email already exists');
    }
  }

  private async generateTokens(user: ActiveUserData) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user.sub, user.email, user.type),
      this.signRefreshToken(user.sub, user.type, refreshTokenId),
    ]);
    await this.refreshTokenStroageService.insert(user.sub, refreshTokenId);
    return { accessToken, refreshToken };
  }

  private async signAccessToken(userId: string, email: string, userType: UserType) {
    return await this.jwtService.signAsync(
      {
        email,
        sub: userId,
        type: userType,
        tokenType: TokenType.ACCESS,
      },
      {
        issuer: this.jwtConfigurations.issuer,
        secret: this.jwtConfigurations.secret,
        audience: this.jwtConfigurations.audience,
        expiresIn: this.jwtConfigurations.accessTokenTtl,
      },
    );
  }

  private async signRefreshToken(userId: string, userType: UserType, refreshTokenId: string) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        type: userType,
        tokenType: TokenType.REFRESH,
        refreshTokenId,
      },
      {
        issuer: this.jwtConfigurations.issuer,
        secret: this.jwtConfigurations.secret,
        audience: this.jwtConfigurations.audience,
        expiresIn: this.jwtConfigurations.refreshTokenTtl,
      },
    );
  }
}
