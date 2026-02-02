import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';

@Injectable()
export class refreshTokenStorageService {
  constructor(private readonly redis: RedisService) {}

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redis.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedTokenId = await this.redis.get(this.getKey(userId));
    if (!storedTokenId || storedTokenId !== tokenId) {
      throw new InvalidRefreshTokenException();
    }
    return tokenId === storedTokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redis.del(this.getKey(userId));
  }

  private getKey(userId: string): string {
    return `refresh-token:${userId}`;
  }
}
