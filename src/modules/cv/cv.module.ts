import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
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
import { CV_MATCHING_QUEUE } from './processor/cv-matching.jobs';
import { CvMatchingProcessor } from './processor/cv-matching.processor';

@Module({
  imports: [
    CvStorageModule,
    DatabaseModule,
    CvParseResultModule,
    NlpModule,
    BullModule.registerQueue({
      name: CV_MATCHING_QUEUE,
    }),
  ],
  controllers: [CvController, CvParseController],
  providers: [
    CvService,
    CvParseService,
    CvMatchingProcessor,
    {
      provide: CvRepository,
      useClass: CvRespositoryImpl,
    },
  ],
  exports: [CvService],
})
export class CvModule {}
