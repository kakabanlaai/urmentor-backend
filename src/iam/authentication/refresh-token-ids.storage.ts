import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redis.set(this.getKey(userId), tokenId);
  }

  async invalidate(userId: number): Promise<void> {
    await this.redis.del(this.getKey(userId));
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storeId = await this.redis.get(this.getKey(userId));
    if (storeId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storeId === tokenId;
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
