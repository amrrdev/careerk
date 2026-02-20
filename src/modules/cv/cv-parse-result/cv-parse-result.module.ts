import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CvParseResultRepository } from './repository/cv-parse-result.repository';
import { CvParseResultRepositoryImpl } from './repository/cv-parse-result.repository.impl';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: CvParseResultRepository,
      useClass: CvParseResultRepositoryImpl,
    },
  ],
  exports: [CvParseResultRepository],
})
export class CvParseResultModule {}
