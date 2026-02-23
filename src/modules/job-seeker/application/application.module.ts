import { Module } from '@nestjs/common';
import { JobSeekerApplicationService } from './application.service';
import { JobSeekerApplicationController } from './application.controller';
import { JobSeekerApplicationRepository } from './repository/application.repository';
import { JobSeekerApplicationRepositoryImpl } from './repository/application.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JobModule } from 'src/modules/jobs/job.module';

@Module({
  imports: [DatabaseModule, JobModule],
  controllers: [JobSeekerApplicationController],
  providers: [
    JobSeekerApplicationService,
    {
      provide: JobSeekerApplicationRepository,
      useClass: JobSeekerApplicationRepositoryImpl,
    },
  ],
})
export class JobSeekerApplicationModule {}
