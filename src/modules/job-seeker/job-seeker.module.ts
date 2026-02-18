import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JobSeekerRepository } from './repositories/job-seeker.repository';
import { JobSeekerRepositoryImpl } from './repositories/job-seeker.repository.impl';
import { WorkExperienceModule } from './work-experience/work-experience.module';
import { EducationModule } from './education/education.module';

@Module({
  imports: [DatabaseModule, WorkExperienceModule, EducationModule],
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
