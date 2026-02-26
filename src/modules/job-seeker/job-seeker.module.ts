import { Module } from '@nestjs/common';
import { JobSeekerController } from './job-seeker.controller';
import { JobSeekerService } from './job-seeker.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JobSeekerRepository } from './repositories/job-seeker.repository';
import { JobSeekerRepositoryImpl } from './repositories/job-seeker.repository.impl';
import { WorkExperienceModule } from './work-experience/work-experience.module';
import { EducationModule } from './education/education.module';
import { SkillsModule } from './skills/skills.module';
import { JobSeekerApplicationModule } from './application/application.module';
import { SkillGapAnalysisModule } from './skill-gap-analysis/skill-gap-analysis.module';
import { SkillGapAnalysisController } from './skill-gap-analysis/skill-gap-analysis.controller';

@Module({
  imports: [
    DatabaseModule,
    WorkExperienceModule,
    EducationModule,
    SkillsModule,
    JobSeekerApplicationModule,
    SkillGapAnalysisModule,
  ],
  controllers: [JobSeekerController, SkillGapAnalysisController],
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
