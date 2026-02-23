import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CompanyApplicationService } from './application.service';
import { CompanyApplicationRepository } from './repository/application.repository';
import { CompanyApplicationRepositoryImpl } from './repository/application.repository.impl';
import { CompanyApplicationController } from './application.controller';
import { CvModule } from 'src/modules/cv/cv.module';

@Module({
  imports: [DatabaseModule, CvModule],
  controllers: [CompanyApplicationController],
  providers: [
    CompanyApplicationService,
    {
      provide: CompanyApplicationRepository,
      useClass: CompanyApplicationRepositoryImpl,
    },
  ],
})
export class CompanyApplicationModule {}
