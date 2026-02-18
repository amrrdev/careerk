import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { EducationRepository } from './repository/education.repository';
import { EducationRepositoryImpl } from './repository/education.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [EducationController],
  providers: [
    EducationService,
    {
      provide: EducationRepository,
      useClass: EducationRepositoryImpl,
    },
  ],
})
export class EducationModule {}
