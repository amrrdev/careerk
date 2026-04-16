import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mediaStorageConfig from './config/media-storage.config';
import { MediaStorageService } from './media-storage.service';

@Module({
  imports: [ConfigModule.forFeature(mediaStorageConfig)],
  providers: [MediaStorageService],
  exports: [MediaStorageService],
})
export class MediaStorageModule {}
