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
      useFactory: (redisConfigurations: ConfigType<typeof redisConfig>) => {
        return new Redis({
          host: redisConfigurations.host,
          port: redisConfigurations.port,
          password: redisConfigurations.password,
        });
      },
      inject: [redisConfig.KEY],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
