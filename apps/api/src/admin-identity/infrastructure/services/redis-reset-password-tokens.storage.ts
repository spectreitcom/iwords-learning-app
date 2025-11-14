import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ResetPasswordTokensStorage } from '../../application/ports/reset-password-tokens.storage';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisResetPasswordTokensStorage
  implements ResetPasswordTokensStorage, OnApplicationShutdown
{
  private readonly redisClient: Redis;

  constructor(configService: ConfigService) {
    this.redisClient = new Redis(
      configService.get<string>('REDIS_URI') as string,
    );
  }

  async insert(userId: string, token: string): Promise<void> {
    await this.redisClient.set(this.getKey(userId), token, 'EX', 60 * 15);
  }

  async remove(userId: string) {
    await this.redisClient.del(this.getKey(userId));
  }

  async getToken(userId: string): Promise<string | null> {
    return this.redisClient.get(this.getKey(userId));
  }

  async validate(userId: string): Promise<boolean> {
    const token = await this.getToken(userId);
    return !!token;
  }

  private getKey(userId: string) {
    return `resetPasswordToken:${userId}`;
  }

  async onApplicationShutdown() {
    await this.redisClient.quit();
  }
}
