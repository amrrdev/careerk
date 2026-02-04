import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import queueConfig from './config/queue.config';

@Module({
  imports: [
    ConfigModule.forFeature(queueConfig),
    BullModule.forRootAsync({
      imports: [ConfigModule.forFeature(queueConfig)],
      inject: [queueConfig.KEY],
      useFactory: (queueConfiguration: ConfigType<typeof queueConfig>) => ({
        connection: {
          host: queueConfiguration.host,
          port: queueConfiguration.port,
          password: queueConfiguration.password,
        },
      }),
    }),
  ],
})
export class QueueModule {}
