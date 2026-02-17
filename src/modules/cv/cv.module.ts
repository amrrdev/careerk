import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { CvRepository } from './repository/cv.repository';
import { CvRespositoryImpl } from './repository/cv.repository.impl';
import { CvStorageModule } from 'src/infrastructure/cv-storage/cv-storage.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [CvStorageModule, DatabaseModule],
  controllers: [CvController],
  providers: [
    CvService,
    {
      provide: CvRepository,
      useClass: CvRespositoryImpl,
    },
  ],
})
export class CvModule {}
