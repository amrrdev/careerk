import { Module } from '@nestjs/common';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperienceService } from './work-experience.service';
import { WorkExperienceRepository } from './repository/work-experience.repository';
import { WorkExperienceRepositoryImpl } from './repository/work-experience.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkExperienceController],
  providers: [
    WorkExperienceService,
    {
      provide: WorkExperienceRepository,
      useClass: WorkExperienceRepositoryImpl,
    },
  ],
})
export class WorkExperienceModule {}
