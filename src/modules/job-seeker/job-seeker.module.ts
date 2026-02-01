import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JobSeekerRepository } from './repositories/job-seeker.repository';
import { JobSeekerRepositoryImpl } from './repositories/job-seeker.repository.impl';

@Module({
  imports: [DatabaseModule],
  controllers: [JobSeekerController],
  providers: [
    JobSeekerService,
    {
      provide: JobSeekerRepository,
      useClass: JobSeekerRepositoryImpl,
    },
  ],
  exports: [JobSeekerRepository],
})
export class JobSeekerModule {}
