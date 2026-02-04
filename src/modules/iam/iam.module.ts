import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { JobSeekerModule } from '../job-seeker/job-seeker.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { CompanyModule } from '../company/company.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { refreshTokenStorageService } from './authentication/refresh-token-storage.service';
import { RolesGuard } from './authentication/guards/roles.guard';
import { EmailModule } from 'src/infrastructure/email/email.module';
import { OtpService } from './otp/otp.service';
import { BullModule } from '@nestjs/bullmq';
import { EMAIL_QUEUE } from './jobs/queue.constants';
import { EmailProcessor } from './processors/email.processor';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
    JobSeekerModule,
    CompanyModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    refreshTokenStorageService,
    OtpService,
    EmailProcessor,
  ],
})
export class IamModule {}
