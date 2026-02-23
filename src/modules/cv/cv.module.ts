import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvRepository } from './repository/cv.repository';
import { CvRespositoryImpl } from './repository/cv.repository.impl';
import { CvStorageModule } from 'src/infrastructure/cv-storage/cv-storage.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CvParseResultModule } from './cv-parse-result/cv-parse-result.module';
import { NlpModule } from 'src/infrastructure/nlp/nlp.module';
import { CvParseController } from './cv-parse.controller';
import { CvParseService } from './cv-parse.service';

@Module({
  imports: [CvStorageModule, DatabaseModule, CvParseResultModule, NlpModule],
  controllers: [CvController, CvParseController],
  providers: [
    CvService,
    CvParseService,
    {
      provide: CvRepository,
      useClass: CvRespositoryImpl,
    },
  ],
  exports: [CvService],
})
export class CvModule {}
