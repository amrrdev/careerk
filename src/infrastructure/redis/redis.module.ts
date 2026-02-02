import { Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import redisConfig from './config/redis.config';
import { ConfigModule, type ConfigType } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (redisConfigrations: ConfigType<typeof redisConfig>) => {
        return new Redis({
          host: redisConfigrations.host,
          port: redisConfigrations.port,
          password: redisConfigrations.password,
        });
      },
      inject: [redisConfig.KEY],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
