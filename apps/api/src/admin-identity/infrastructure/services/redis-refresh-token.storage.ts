import { Injectable } from '@nestjs/common';
import { RefreshTokenStorage } from '../../application/ports/refresh-token.storage';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisRefreshTokenStorage implements RefreshTokenStorage {
  private readonly redisClient: Redis;

  constructor(configService: ConfigService) {
    this.redisClient = new Redis(
      configService.get<string>('REDIS_URI') as string,
    );
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), tokenId);
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedTokenId = await this.redisClient.get(this.getKey(userId));
    return storedTokenId === tokenId;
  }

  private getKey(userId: string) {
    return `refreshToken:${userId}`;
  }
}
