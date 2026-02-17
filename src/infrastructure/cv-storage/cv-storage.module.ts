import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import cvStorageConfig from './config/cv-storage.config';
import { CvStorageService } from './cv-stroage.service';

@Module({
  imports: [ConfigModule.forFeature(cvStorageConfig)],
  providers: [CvStorageService],
  exports: [CvStorageService],
})
export class CvStorageModule {}
