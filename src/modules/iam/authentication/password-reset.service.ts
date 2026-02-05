import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JobSeekerRepository } from 'src/modules/job-seeker/repositories/job-seeker.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { AuthenticationService } from './authentication.service';
import { UserType } from '../enums/user-type.enum';
import { OtpService } from '../otp/otp.service';
import { OtpPurpose } from '../enums/otp-purpose.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { EMAIL_QUEUE, SEND_PASSWORD_RESET_EMAIL_JOB } from '../jobs/queue.constants';
import { Queue } from 'bullmq';
import { SendPasswordResetEmailJob } from '../jobs/send-password-reset-email.job';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { HashingService } from '../hashing/hashing.service';
import { RefreshTokenStorageService } from './refresh-token-storage.service';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly authenticationService: AuthenticationService,
    private readonly otpService: OtpService,
    private readonly hashingService: HashingService,
    private readonly refreshTokenStorageService: RefreshTokenStorageService,
    @InjectQueue(EMAIL_QUEUE)
    private readonly emailQueue: Queue,
  ) {}

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    this.processForgotPassword(forgotPasswordDto.email).catch((err) => {
      this.logger.error(`Forgot password processing failed for ${forgotPasswordDto.email}:`, err);
    });
    return {
      email: forgotPasswordDto.email,
    };
  }

  async processForgotPassword(email: string) {
    try {
      const [jobSeeker, company] = await Promise.all([
        this.jobSeekerRepository.findByEmail(email),
        this.companyRepository.findByEmail(email),
      ]);

      const user = jobSeeker || company;
      if (!user) {
        return;
      }
      const userType = jobSeeker ? UserType.JOB_SEEKER : UserType.COMPANY;
      const userName = jobSeeker ? jobSeeker.firstName : company?.name;

      const otp = await this.otpService.createOtp(email, OtpPurpose.PASSWORD_RESET, userType);
      await this.emailQueue.add(
        SEND_PASSWORD_RESET_EMAIL_JOB,
        {
          email: user.email,
          code: otp,
          userName,
        } as SendPasswordResetEmailJob,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );
    } catch (err) {
      this.logger.error(`Failed to process forgot password for: ${email}`, err);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const otpData = await this.otpService.verifyOtp(
        resetPasswordDto.email,
        resetPasswordDto.code,
        OtpPurpose.PASSWORD_RESET,
      );
      if (!otpData) {
        throw new UnauthorizedException('expired reset code');
      }

      const newPassword = await this.hashingService.hash(resetPasswordDto.newPassword);
      const updatedUser =
        otpData.userType === UserType.JOB_SEEKER
          ? await this.jobSeekerRepository.findByEmailAndUpdatePassword(
              resetPasswordDto.email,
              newPassword,
            )
          : await this.companyRepository.findByEmailAndUpdatePassword(
              resetPasswordDto.email,
              newPassword,
            );

      if (!updatedUser) {
        throw new UnauthorizedException('User not found');
      }

      await this.refreshTokenStorageService.invalidate(updatedUser.id);
      return {
        message: 'Password has been reset successfully',
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Password reset failed');
    }
  }
}
