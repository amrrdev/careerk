import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CompanyRepository } from './repositories/company.repository';
import { CompanyRepositoryImpl } from './repositories/company.repository.impl';
import { DirectJobModule } from './direct-jobs/direct-job.module';

@Module({
  imports: [DatabaseModule, DirectJobModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryImpl,
    },
  ],
  exports: [CompanyRepository],
})
export class CompanyModule {}
