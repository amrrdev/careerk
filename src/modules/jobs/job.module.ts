import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobRepository } from './repository/job.repository';
import { JobRepositoryImpl } from './repository/job.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [JobController],
  providers: [
    JobService,
    {
      provide: JobRepository,
      useClass: JobRepositoryImpl,
    },
  ],
})
export class JobModule {}
