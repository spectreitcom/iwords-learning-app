import { RefreshTokenStorage } from '../../../ports/refresh-token.storage';

export class FakeRefreshTokenStorage implements RefreshTokenStorage {
  private readonly storage = new Map<string, string>();

  async insert(userId: string, tokenId: string): Promise<void> {
    this.storage.set(userId, tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    return this.storage.get(userId) === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    this.storage.delete(userId);
  }
}
