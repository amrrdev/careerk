import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CompanyRepository } from './repositores/company.repository';
import { CompanyRepositoryImpl } from './repositores/company.repository.impl';

@Module({
  imports: [DatabaseModule],
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
