import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { JobSeekerModule } from './modules/job-seeker/job-seeker.module';
import { CompanyModule } from './modules/company/company.module';
import { IamModule } from './modules/iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './infrastructure/redis/redis.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { EmailModule } from './infrastructure/email/email.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { CvModule } from './modules/cv/cv.module';
import { CvStorageModule } from './infrastructure/cv-storage/cv-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    InfrastructureModule,
    JobSeekerModule,
    CompanyModule,
    IamModule,
    RedisModule,
    EmailModule,
    QueueModule,
    CvModule,
    CvStorageModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
