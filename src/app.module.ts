import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { JobSeekerModule } from './modules/job-seeker/job-seeker.module';
import { CompanyModule } from './modules/company/company.module';
import { IamModule } from './modules/iam/iam.module';

@Module({
  imports: [InfrastructureModule, JobSeekerModule, CompanyModule, IamModule],
})
export class AppModule {}
